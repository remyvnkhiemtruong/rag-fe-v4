import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const CHART_TYPE_OPTIONS = [
  { value: "pie", labelKey: "economic.chartPie" },
  { value: "bar", labelKey: "economic.chartBar" },
  { value: "bar_horizontal", labelKey: "economic.chartBarHorizontal" },
  { value: "line", labelKey: "economic.chartLine" },
  { value: "area", labelKey: "economic.chartArea" },
  { value: "radar", labelKey: "economic.chartRadar" },
  { value: "radialBar", labelKey: "economic.chartRadialBar" },
  { value: "composed", labelKey: "economic.chartComposed" },
  { value: "funnel", labelKey: "economic.chartFunnel" },
  { value: "scatter", labelKey: "economic.chartScatter" },
  { value: "treemap", labelKey: "economic.chartTreemap" },
];

const SECTION_CONFIG = {
  economics: {
    extraFields: [
      { key: "sector", labelKey: "admin.economicsSector" },
      { key: "source", labelKey: "admin.economicsSource" },
    ],
    hasDistribution: true,
    hasChartConfigs: true,
    listSubtitleKey: "sector",
  },
  geography: {
    extraFields: [
      { key: "region", labelKey: "admin.geographyRegion" },
      { key: "area", labelKey: "admin.geographyArea" },
      { key: "terrain", labelKey: "admin.geographyTerrain", textarea: true },
    ],
    listSubtitleKey: "region",
  },
  literature: {
    extraFields: [
      { key: "author", labelKey: "admin.literatureAuthor" },
      { key: "genre", labelKey: "admin.literatureGenre" },
      { key: "period", labelKey: "admin.literaturePeriod" },
      { key: "audio_url", labelKey: "admin.literatureAudioUrl" },
    ],
    listSubtitleKey: "author",
    hasAudioUpload: true,
  },
};

/**
 * CRUD for economics / geography / literature with domain-specific fields.
 * api: { getAll, getById, create, update, delete }
 * sectionType: 'economics' | 'geography' | 'literature'
 */
export default function InfoSectionManagement({
  api,
  sectionType,
  titleKey,
  addKey,
  confirmDeleteKey,
  onBack,
}) {
  const { t } = useTranslation();
  const config = SECTION_CONFIG[sectionType] || { extraFields: [], listSubtitleKey: null };
  const extraFields = config.extraFields;

  const initialForm = useMemo(() => {
    const base = { title: "", content: "", image_url: "" };
    extraFields.forEach((f) => (base[f.key] = ""));
    return base;
  }, [extraFields]);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [distributions, setDistributions] = useState([]);
  const [chartConfigs, setChartConfigs] = useState([]);
  const [editingChartIndex, setEditingChartIndex] = useState(null);
  const [chartForm, setChartForm] = useState({
    chartType: "pie",
    title: "",
    layout: "vertical",
    stacked: false,
    innerRadius: "",
    outerRadius: "",
    data: [],
    unit: "",
    seriesLabels: ["", ""],
  });
  const [literatureAudioFile, setLiteratureAudioFile] = useState(null);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getAll(1, 100);
      setList(result.data || []);
    } catch {
      alert(t("admin.loadError"));
    } finally {
      setLoading(false);
    }
  }, [api, t]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...initialForm });
    setDistributions([]);
    setChartConfigs([]);
    setEditingChartIndex(null);
    setLiteratureAudioFile(null);
    setShowModal(true);
  };

  const resolveImageUrl = (item) =>
    item.image_url ??
    item.media?.find((m) => m.media_type === "image")?.file_url ??
    "";

  const openEdit = (item) => {
    setEditingId(item.id);
    const next = { ...initialForm };

    ["title", "content"].forEach((k) => (next[k] = item[k] ?? ""));

    next.image_url = resolveImageUrl(item);

    extraFields.forEach((f) => (next[f.key] = item[f.key] ?? ""));

    setForm(next);
    setDistributions(item.distributions || []);
    setChartConfigs(
      (Array.isArray(item.chart_configs) ? item.chart_configs : []).map((c) =>
        c.chartType === "bar" && c.layout === "horizontal"
          ? { ...c, chartType: "bar_horizontal" }
          : { ...c }
      )
    );
    setEditingChartIndex(null);
    setLiteratureAudioFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t(confirmDeleteKey))) return;
    try {
      await api.delete(id);
      fetchList();
    } catch {
      alert(t("admin.errGeneric"));
    }
  };

  const buildBody = () => {
    const body = {
      title: form.title?.trim() ?? "",
      content: form.content?.trim() ?? "",
      image_url: form.image_url?.trim() || null,
    };

    extraFields.forEach((f) => {
      body[f.key] = form[f.key]?.trim() || null;
    });

    if (config.hasDistribution) {
      body.distributions = distributions.filter(
        (d) => d.component_name && d.percentage >= 0
      );
    }

    if (config.hasChartConfigs) {
      body.chart_configs = chartConfigs.map((c) => {
        const chartType = c.chartType === "bar_horizontal" ? "bar" : c.chartType;
        const layout = c.chartType === "bar_horizontal" ? "horizontal" : c.layout;
        const out = { chartType, title: c.title || "", data: c.data || [], unit: c.unit ?? "" };
        if (layout) out.layout = layout;
        if (c.stacked) out.stacked = true;
        if (c.innerRadius != null && c.innerRadius !== "") out.innerRadius = Number(c.innerRadius);
        if (c.outerRadius != null && c.outerRadius !== "") out.outerRadius = Number(c.outerRadius);
        if (chartType === "composed" && Array.isArray(c.seriesLabels)) out.seriesLabels = c.seriesLabels.slice(0, 2);
        return out;
      });
    }

    return body;
  };

  const handleSubmit = async () => {
    if (!form.title?.trim()) {
      alert(t("admin.requiredFields"));
      return;
    }
    try {
      setSubmitting(true);
      const body = buildBody();
      const useFormData = config.hasAudioUpload && literatureAudioFile;
      if (useFormData) {
        const fd = new FormData();
        Object.entries(body).forEach(([k, v]) => {
          if (v != null && v !== "") fd.append(k, v);
        });
        fd.append("literature_audio", literatureAudioFile);
        if (editingId) {
          await api.update(editingId, fd);
        } else {
          await api.create(fd);
        }
      } else {
        if (editingId) {
          await api.update(editingId, body);
        } else {
          await api.create(body);
        }
      }
      setShowModal(false);
      setEditingId(null);
      setForm({ ...initialForm });
      setLiteratureAudioFile(null);
      fetchList();
    } catch {
      alert(t("admin.errGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  const subtitleKey = config.listSubtitleKey;

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="w-24 flex-shrink-0">
          {onBack ? (
            <button
              onClick={onBack}
              className="text-heritage-red-600 dark:text-heritage-red-400 hover:underline text-sm"
            >
              ← {t("common.back")}
            </button>
          ) : null}
        </div>
        <h2 className="text-xl font-semibold text-center flex-1">{t(titleKey)}</h2>
        <div className="w-24 flex-shrink-0 flex justify-end">
          <button
            onClick={openCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded dark:bg-blue-500 dark:hover:bg-blue-600 text-sm whitespace-nowrap"
          >
            + {t(addKey)}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">{t("common.loading")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800"
            >
              <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate" title={item.title}>
                {item.title || t("admin.noData")}
              </h3>
              {subtitleKey && item[subtitleKey] ? (
                <p className="text-sm text-heritage-red-600 dark:text-heritage-red-400 mt-0.5 truncate">
                  {item[subtitleKey]}
                </p>
              ) : null}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {item.content || "—"}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openEdit(item)}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  {t("common.edit")}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 dark:text-red-400 hover:underline text-sm"
                >
                  {t("common.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-lg border border-gray-200 dark:border-gray-600 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {editingId ? t("admin.editItem") : t(addKey)}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("admin.infoTitle")} *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder={t("admin.infoTitlePlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("admin.infoContent")}
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder={t("admin.infoContentPlaceholder")}
                />
              </div>
              {extraFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t(field.labelKey)}
                  </label>
                  {field.textarea ? (
                    <textarea
                      value={form[field.key] ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      rows={2}
                      className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  ) : (
                    <input
                      type="text"
                      value={form[field.key] ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  )}
                </div>
              ))}
              {config.hasDistribution && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("admin.economicsDistribution")}
                  </label>

                  <div className="space-y-2">
                    {distributions.map((d, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          placeholder={t("admin.componentName")}
                          value={d.component_name}
                          onChange={(e) => {
                            const next = [...distributions];
                            next[idx].component_name = e.target.value;
                            setDistributions(next);
                          }}
                          className="flex-1 border px-2 py-1 rounded"
                        />

                        <input
                          type="number"
                          placeholder="%"
                          value={d.percentage}
                          onChange={(e) => {
                            const next = [...distributions];
                            next[idx].percentage = Number(e.target.value);
                            setDistributions(next);
                          }}
                          className="w-24 border px-2 py-1 rounded"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setDistributions(distributions.filter((_, i) => i !== idx))
                          }
                          className="text-red-500 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setDistributions([
                        ...distributions,
                        { component_name: "", percentage: 0 },
                      ])
                    }
                    className="mt-2 text-blue-600 text-sm"
                  >
                    + {t("admin.addComponent")}
                  </button>
                </div>
              )}
              {config.hasChartConfigs && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("economic.chartSection", "Biểu đồ")}
                  </label>
                  <div className="space-y-2">
                    {chartConfigs.map((cfg, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 py-2 border-b border-gray-200 dark:border-gray-600"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {cfg.title || t(CHART_TYPE_OPTIONS.find((o) => o.value === cfg.chartType)?.labelKey || "economic.chartPie")}
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              const isBarH = cfg.chartType === "bar" && cfg.layout === "horizontal";
                              setChartForm({
                                chartType: isBarH ? "bar_horizontal" : cfg.chartType,
                                title: cfg.title || "",
                                layout: cfg.layout || "vertical",
                                stacked: !!cfg.stacked,
                                innerRadius: cfg.innerRadius ?? "",
                                outerRadius: cfg.outerRadius ?? "",
                                data: Array.isArray(cfg.data) ? cfg.data.map((r) => ({ ...r })) : [],
                                unit: cfg.unit ?? "",
                                seriesLabels: Array.isArray(cfg.seriesLabels) ? [...cfg.seriesLabels.slice(0, 2)] : ["", ""],
                              });
                              setEditingChartIndex(idx);
                            }}
                            className="text-blue-600 text-sm"
                          >
                            {t("common.edit")}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setChartConfigs(chartConfigs.filter((_, i) => i !== idx))
                            }
                            className="text-red-500 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {editingChartIndex === null ? (
                    <button
                      type="button"
                      onClick={() => {
                        setChartForm({
                          chartType: "pie",
                          title: "",
                          layout: "vertical",
                          stacked: false,
                          innerRadius: "",
                          outerRadius: "",
                          data: [],
                          unit: "",
                          seriesLabels: ["", ""],
                        });
                        setEditingChartIndex("new");
                      }}
                      className="mt-2 text-blue-600 text-sm"
                    >
                      + {t("economic.addChart", "Thêm biểu đồ")}
                    </button>
                  ) : (
                    <div className="mt-3 p-3 border border-gray-200 dark:border-gray-600 rounded space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          {t("economic.chartType", "Loại biểu đồ")}
                        </label>
                        <select
                          value={chartForm.chartType}
                          onChange={(e) =>
                            setChartForm((f) => ({ ...f, chartType: e.target.value }))
                          }
                          className="w-full border border-gray-300 dark:border-gray-600 px-2 py-1.5 rounded text-sm bg-white dark:bg-gray-700"
                        >
                          {CHART_TYPE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {t(o.labelKey)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          {t("economic.chartTitle", "Tiêu đề")}
                        </label>
                        <input
                          type="text"
                          value={chartForm.title}
                          onChange={(e) =>
                            setChartForm((f) => ({ ...f, title: e.target.value }))
                          }
                          className="w-full border border-gray-300 dark:border-gray-600 px-2 py-1.5 rounded text-sm"
                          placeholder={t("economic.chartTitlePlaceholder", "Tiêu đề biểu đồ")}
                        />
                      </div>
                      {["line", "area", "funnel"].includes(chartForm.chartType) && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {t("economic.chartLayout", "Hướng")}
                          </label>
                          <select
                            value={chartForm.layout}
                            onChange={(e) =>
                              setChartForm((f) => ({ ...f, layout: e.target.value }))
                            }
                            className="w-full border border-gray-300 dark:border-gray-600 px-2 py-1.5 rounded text-sm bg-white dark:bg-gray-700"
                          >
                            <option value="vertical">{t("economic.layoutVertical", "Dọc")}</option>
                            <option value="horizontal">{t("economic.layoutHorizontal", "Ngang")}</option>
                          </select>
                        </div>
                      )}
                      {chartForm.chartType === "bar" && (
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={chartForm.stacked}
                            onChange={(e) =>
                              setChartForm((f) => ({ ...f, stacked: e.target.checked }))
                            }
                          />
                          {t("economic.stacked", "Xếp chồng")}
                        </label>
                      )}
                      {chartForm.chartType === "area" && (
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={chartForm.stacked}
                            onChange={(e) =>
                              setChartForm((f) => ({ ...f, stacked: e.target.checked }))
                            }
                          />
                          {t("economic.stacked", "Xếp chồng")}
                        </label>
                      )}
                      {["pie", "radialBar"].includes(chartForm.chartType) && (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500">innerRadius</label>
                              <input
                                type="number"
                                value={chartForm.innerRadius}
                                onChange={(e) =>
                                  setChartForm((f) => ({ ...f, innerRadius: e.target.value }))
                                }
                                className="w-full border px-2 py-1 rounded text-sm"
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500">outerRadius</label>
                              <input
                                type="number"
                                value={chartForm.outerRadius}
                                onChange={(e) =>
                                  setChartForm((f) => ({ ...f, outerRadius: e.target.value }))
                                }
                                className="w-full border px-2 py-1 rounded text-sm"
                                placeholder="80"
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {chartForm.chartType === "radar" && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {t("economic.chartLayout", "Layout")}
                          </label>
                          <select
                            value={chartForm.layout}
                            onChange={(e) =>
                              setChartForm((f) => ({ ...f, layout: e.target.value }))
                            }
                            className="w-full border border-gray-300 dark:border-gray-600 px-2 py-1.5 rounded text-sm bg-white dark:bg-gray-700"
                          >
                            <option value="centric">centric</option>
                            <option value="radial">radial</option>
                          </select>
                        </div>
                      )}
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          {t("economic.componentsAndFiguresForChart", "Thành phần và số liệu cho biểu đồ này")}
                        </label>
                        {chartForm.chartType === "composed" ? (
                          <>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <input
                                type="text"
                                value={chartForm.seriesLabels[0] ?? ""}
                                onChange={(e) =>
                                  setChartForm((f) => ({
                                    ...f,
                                    seriesLabels: [e.target.value, f.seriesLabels[1] ?? ""],
                                  }))
                                }
                                className="border px-2 py-1 rounded text-sm"
                                placeholder={t("economic.seriesLabel1", "Nhãn cột 1 (vd. Năm 2023)")}
                              />
                              <input
                                type="text"
                                value={chartForm.seriesLabels[1] ?? ""}
                                onChange={(e) =>
                                  setChartForm((f) => ({
                                    ...f,
                                    seriesLabels: [f.seriesLabels[0] ?? "", e.target.value],
                                  }))
                                }
                                className="border px-2 py-1 rounded text-sm"
                                placeholder={t("economic.seriesLabel2", "Nhãn cột 2 (vd. Năm 2024)")}
                              />
                            </div>
                            <div className="space-y-2">
                              {(chartForm.data || []).map((row, idx) => (
                                <div key={idx} className="flex gap-2 items-center flex-wrap">
                                  <input
                                    type="text"
                                    placeholder={t("admin.componentName")}
                                    value={row.component_name ?? ""}
                                    onChange={(e) => {
                                      const next = [...(chartForm.data || [])];
                                      next[idx] = { ...next[idx], component_name: e.target.value, value1: next[idx].value1 ?? 0, value2: next[idx].value2 ?? 0 };
                                      setChartForm((f) => ({ ...f, data: next }));
                                    }}
                                    className="flex-1 min-w-[100px] border px-2 py-1 rounded text-sm"
                                  />
                                  <input
                                    type="number"
                                    placeholder="1"
                                    value={row.value1 ?? row.value ?? ""}
                                    onChange={(e) => {
                                      const next = [...(chartForm.data || [])];
                                      next[idx] = { ...next[idx], value1: Number(e.target.value) || 0 };
                                      setChartForm((f) => ({ ...f, data: next }));
                                    }}
                                    className="w-20 border px-2 py-1 rounded text-sm"
                                  />
                                  <input
                                    type="number"
                                    placeholder="2"
                                    value={row.value2 ?? ""}
                                    onChange={(e) => {
                                      const next = [...(chartForm.data || [])];
                                      next[idx] = { ...next[idx], value2: Number(e.target.value) || 0 };
                                      setChartForm((f) => ({ ...f, data: next }));
                                    }}
                                    className="w-20 border px-2 py-1 rounded text-sm"
                                  />
                                  <button type="button" onClick={() => setChartForm((f) => ({ ...f, data: (f.data || []).filter((_, i) => i !== idx) }))} className="text-red-500 text-sm">✕</button>
                                </div>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setChartForm((f) => ({
                                  ...f,
                                  data: [...(f.data || []), { component_name: "", value1: 0, value2: 0 }],
                                }))
                              }
                              className="mt-2 text-blue-600 text-sm"
                            >
                              + {t("admin.addComponent")}
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="mb-2">
                              <label className="block text-xs text-gray-500 mb-0.5">{t("economic.unit", "Đơn vị")}</label>
                              <select
                                value={chartForm.unit}
                                onChange={(e) => setChartForm((f) => ({ ...f, unit: e.target.value }))}
                                className="w-full border border-gray-300 dark:border-gray-600 px-2 py-1 rounded text-sm bg-white dark:bg-gray-700"
                              >
                                <option value="">—</option>
                                <option value="%">%</option>
                                <option value="tỷ">{t("economic.unitBillion", "Tỷ")}</option>
                                <option value="triệu">{t("economic.unitMillion", "Triệu")}</option>
                                <option value="nghìn tỷ">{t("economic.unitTrillion", "Nghìn tỷ")}</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              {(chartForm.data || []).map((row, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                  <input
                                    type="text"
                                    placeholder={t("admin.componentName")}
                                    value={row.component_name ?? ""}
                                    onChange={(e) => {
                                      const next = [...(chartForm.data || [])];
                                      next[idx] = { ...next[idx], component_name: e.target.value, value: next[idx].value ?? 0 };
                                      setChartForm((f) => ({ ...f, data: next }));
                                    }}
                                    className="flex-1 border px-2 py-1 rounded text-sm"
                                  />
                                  <input
                                    type="number"
                                    placeholder="0"
                                    value={row.value ?? row.value1 ?? row.percentage ?? ""}
                                    onChange={(e) => {
                                      const next = [...(chartForm.data || [])];
                                      next[idx] = { ...next[idx], value: Number(e.target.value) };
                                      setChartForm((f) => ({ ...f, data: next }));
                                    }}
                                    className="w-24 border px-2 py-1 rounded text-sm"
                                  />
                                  <button type="button" onClick={() => setChartForm((f) => ({ ...f, data: (f.data || []).filter((_, i) => i !== idx) }))} className="text-red-500 text-sm">✕</button>
                                </div>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setChartForm((f) => ({
                                  ...f,
                                  data: [...(f.data || []), { component_name: "", value: 0 }],
                                }))
                              }
                              className="mt-2 text-blue-600 text-sm"
                            >
                              + {t("admin.addComponent")}
                            </button>
                          </>
                        )}
                      </div>
                      <div className="flex gap-2 pt-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setEditingChartIndex(null)}
                          className="text-gray-600 text-sm"
                        >
                          {t("common.cancel")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = (chartForm.data || []).filter((r) => r && (r.component_name != null && String(r.component_name).trim() !== ""));
                            const entry = {
                              chartType: chartForm.chartType,
                              title: chartForm.title,
                              layout: chartForm.layout,
                              stacked: chartForm.stacked,
                              data:
                                chartForm.chartType === "composed"
                                  ? filtered.map((r) => ({ component_name: r.component_name?.trim(), value1: Number(r.value1) ?? Number(r.value) ?? 0, value2: Number(r.value2) ?? 0 }))
                                  : filtered.map((r) => ({ component_name: r.component_name?.trim(), value: Number(r.value) ?? Number(r.value1) ?? Number(r.percentage) ?? 0 })),
                              unit: chartForm.unit ?? "",
                            };
                            if (chartForm.innerRadius !== "") entry.innerRadius = Number(chartForm.innerRadius);
                            if (chartForm.outerRadius !== "") entry.outerRadius = Number(chartForm.outerRadius);
                            if (chartForm.chartType === "composed") entry.seriesLabels = [...(chartForm.seriesLabels || ["", ""]).slice(0, 2)];
                            if (editingChartIndex === "new") {
                              setChartConfigs([...chartConfigs, entry]);
                            } else {
                              const next = [...chartConfigs];
                              next[editingChartIndex] = entry;
                              setChartConfigs(next);
                            }
                            setEditingChartIndex(null);
                          }}
                          className="text-blue-600 text-sm"
                        >
                          {t("common.save")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("admin.infoImageUrl")}
                </label>
                <input
                  type="text"
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="https://..."
                />
              </div>
              {config.hasAudioUpload && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("admin.literatureAudioUpload", "Upload audio (sách nói)")}
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setLiteratureAudioFile(e.target.files?.[0] ?? null)}
                    className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  {literatureAudioFile && (
                    <p className="text-xs text-gray-500 mt-1">{literatureAudioFile.name}</p>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50"
              >
                {submitting ? t("common.loading") : t("common.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
