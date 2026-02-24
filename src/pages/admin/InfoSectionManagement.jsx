import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

const SECTION_CONFIG = {
  economics: {
    extraFields: [
      { key: "sector", labelKey: "admin.economicsSector" },
      { key: "source", labelKey: "admin.economicsSource" },
    ],
    hasDistribution: true,
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
    ],
    listSubtitleKey: "author",
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

  const initialForm = useMemo(() => {
    const base = { title: "", content: "", image_url: "" };
    config.extraFields.forEach((f) => (base[f.key] = ""));
    return base;
  }, [sectionType]);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [distributions, setDistributions] = useState([]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const result = await api.getAll(1, 100);
      setList(result.data || []);
    } catch {
      alert(t("admin.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...initialForm });
    setDistributions([]);
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

    config.extraFields.forEach((f) => (next[f.key] = item[f.key] ?? ""));

    setForm(next);
    setDistributions(item.distributions || []);
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

    config.extraFields.forEach((f) => {
      body[f.key] = form[f.key]?.trim() || null;
    });

    if (config.hasDistribution) {
      body.distributions = distributions.filter(
        (d) => d.component_name && d.percentage >= 0
      );
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
      if (editingId) {
        await api.update(editingId, body);
      } else {
        await api.create(body);
      }
      setShowModal(false);
      setEditingId(null);
      setForm({ ...initialForm });
      fetchList();
    } catch (error) {
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
              {config.extraFields.map((field) => (
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
