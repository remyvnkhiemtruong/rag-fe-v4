import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { adminGeographyApi } from "../../services/api";

const emptyMeasurement = () => ({ measurement_type: "", value: "", unit: "" });
const emptySignificance = () => ({ category: "", description: "" });
const emptyMedia = () => ({ media_type: "image", file_url: "" });
const emptySource = () => ({ title: "", source_url: "" });

export default function GeographyManagement({ onBack }) {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    location_text: "",
    latitude: "",
    longitude: "",
    terrain_type: "",
    natural_features: "",
    significance: "",
    measurements: [emptyMeasurement()],
    significance_categories: [emptySignificance()],
    media: [emptyMedia()],
    sources: [emptySource()],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await adminGeographyApi.getAll(1, 100);
      setList(res.data || []);
    } catch {
      alert(t("admin.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      name: "",
      location_text: "",
      latitude: "",
      longitude: "",
      terrain_type: "",
      natural_features: "",
      significance: "",
      measurements: [emptyMeasurement()],
      significance_categories: [emptySignificance()],
      media: [emptyMedia()],
      sources: [emptySource()],
    });
    setShowModal(true);
  };

  const openEdit = async (item) => {
    setEditingId(item.id);
    try {
      const res = await adminGeographyApi.getById(item.id);
      const d = res.data || res;
      setForm({
        name: d.name ?? "",
        location_text: d.location_text ?? "",
        latitude: d.latitude ?? "",
        longitude: d.longitude ?? "",
        terrain_type: d.terrain_type ?? "",
        natural_features: d.natural_features ?? "",
        significance: d.significance ?? "",
        measurements: (d.measurements && d.measurements.length) ? d.measurements.map((m) => ({ measurement_type: m.measurement_type ?? "", value: m.value ?? "", unit: m.unit ?? "" })) : [emptyMeasurement()],
        significance_categories: (d.significance_categories && d.significance_categories.length) ? d.significance_categories.map((s) => ({ category: s.category ?? "", description: s.description ?? "" })) : [emptySignificance()],
        media: (d.media && d.media.length) ? d.media.map((m) => ({ media_type: m.media_type ?? "image", file_url: m.file_url ?? "" })) : [emptyMedia()],
        sources: (d.sources && d.sources.length) ? d.sources.map((s) => ({ title: s.title ?? "", source_url: s.source_url ?? "" })) : [emptySource()],
      });
      setShowModal(true);
    } catch {
      alert(t("admin.loadError"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("admin.confirmDeleteInfo"))) return;
    try {
      await adminGeographyApi.delete(id);
      fetchList();
    } catch {
      alert(t("admin.errGeneric"));
    }
  };

  const buildBody = () => {
    return {
      name: form.name.trim() || null,
      title: form.name.trim() || null,
      location_text: form.location_text.trim() || null,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
      terrain_type: form.terrain_type.trim() || null,
      natural_features: form.natural_features.trim() || null,
      significance: form.significance.trim() || null,
      measurements: form.measurements.filter((m) => m.measurement_type && m.value !== "" && m.unit).map((m) => ({ measurement_type: m.measurement_type, value: Number(m.value), unit: m.unit })),
      significance_categories: form.significance_categories.filter((s) => s.category && s.description).map((s) => ({ category: s.category, description: s.description })),
      media: form.media.filter((m) => m.media_type && m.file_url).map((m) => ({ media_type: m.media_type, file_url: m.file_url })),
      sources: form.sources.filter((s) => s.title || s.source_url).map((s) => ({ title: s.title || null, source_url: s.source_url || null })),
    };
  };

  const handleSubmit = async () => {
    if (!form.name?.trim()) {
      alert(t("admin.requiredFields"));
      return;
    }
    try {
      setSubmitting(true);
      const body = buildBody();
      if (editingId) await adminGeographyApi.update(editingId, body);
      else await adminGeographyApi.create(body);
      setShowModal(false);
      setEditingId(null);
      fetchList();
    } catch (e) {
      alert(e?.message || t("admin.errGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  const updateList = (key, idx, field, value) => {
    const arr = [...form[key]];
    arr[idx] = { ...arr[idx], [field]: value };
    setForm((f) => ({ ...f, [key]: arr }));
  };

  const addRow = (key, empty) => {
    setForm((f) => ({ ...f, [key]: [...f[key], empty()] }));
  };

  const removeRow = (key, idx) => {
    setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }));
  };

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between gap-4 mb-6">
        {onBack && (
          <button onClick={onBack} className="text-heritage-red-600 dark:text-heritage-red-400 hover:underline text-sm">
            ← {t("common.back")}
          </button>
        )}
        <h2 className="text-xl font-semibold flex-1 text-center">{t("admin.geographyManagement")}</h2>
        <div className="w-24 flex justify-end">
          <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
            + {t("admin.addGeography")}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">{t("common.loading")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((item) => (
            <div key={item.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
              <h3 className="font-medium truncate">{item.title || item.name || "—"}</h3>
              <p className="text-sm text-gray-500">{item.region || item.location_text}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => openEdit(item)} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  {t("common.edit")}
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline text-sm">
                  {t("common.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-600 shadow-xl">
            <h3 className="text-lg font-semibold p-4 border-b dark:border-gray-600">
              {editingId ? t("common.edit") : t("admin.addGeography")}
            </h3>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("geography.name", "Tên địa danh")} *</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("geography.location", "Vị trí (text)")}</label>
                <input type="text" value={form.location_text} onChange={(e) => setForm((f) => ({ ...f, location_text: e.target.value }))} className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600" placeholder="Xã/Tỉnh" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">{t("geography.latitude", "Vĩ độ")}</label>
                  <input type="number" step="any" value={form.latitude} onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))} className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t("geography.longitude", "Kinh độ")}</label>
                  <input type="number" step="any" value={form.longitude} onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))} className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("geography.terrainType", "Phân loại địa hình")}</label>
                <input type="text" value={form.terrain_type} onChange={(e) => setForm((f) => ({ ...f, terrain_type: e.target.value }))} className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600" placeholder="Sông/Núi/Biển/..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("geography.naturalFeatures", "Đặc điểm tự nhiên")}</label>
                <textarea value={form.natural_features} onChange={(e) => setForm((f) => ({ ...f, natural_features: e.target.value }))} rows={2} className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("geography.significance", "Ý nghĩa tổng quát")}</label>
                <textarea value={form.significance} onChange={(e) => setForm((f) => ({ ...f, significance: e.target.value }))} rows={2} className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t("geography.measurements", "Thông số đo lường")}</label>
                {form.measurements.map((m, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input placeholder={t("geography.measurementType", "Loại")} value={m.measurement_type} onChange={(e) => updateList("measurements", idx, "measurement_type", e.target.value)} className="flex-1 border px-2 py-1 rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                    <input type="number" step="any" placeholder="Giá trị" value={m.value} onChange={(e) => updateList("measurements", idx, "value", e.target.value)} className="w-24 border px-2 py-1 rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                    <input placeholder={t("geography.unit", "Đơn vị")} value={m.unit} onChange={(e) => updateList("measurements", idx, "unit", e.target.value)} className="w-20 border px-2 py-1 rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                    <button type="button" onClick={() => removeRow("measurements", idx)} className="text-red-500 text-sm">✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => addRow("measurements", emptyMeasurement)} className="text-blue-600 text-sm">+ {t("geography.addMeasurement", "Thêm")}</button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t("geography.significanceCategories", "Ý nghĩa (theo danh mục)")}</label>
                {form.significance_categories.map((s, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input placeholder={t("geography.category", "Danh mục")} value={s.category} onChange={(e) => updateList("significance_categories", idx, "category", e.target.value)} className="w-32 border px-2 py-1 rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                    <input placeholder={t("geography.description", "Mô tả")} value={s.description} onChange={(e) => updateList("significance_categories", idx, "description", e.target.value)} className="flex-1 border px-2 py-1 rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                    <button type="button" onClick={() => removeRow("significance_categories", idx)} className="text-red-500 text-sm">✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => addRow("significance_categories", emptySignificance)} className="text-blue-600 text-sm">+ {t("geography.addSignificance", "Thêm")}</button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t("geography.media", "Tài liệu / Ảnh / Bản đồ / Google Maps")}</label>
                {form.media.map((m, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <select value={m.media_type} onChange={(e) => updateList("media", idx, "media_type", e.target.value)} className="border px-2 py-1 rounded text-sm dark:bg-gray-700 dark:border-gray-600">
                      <option value="image">image</option>
                      <option value="map">map</option>
                      <option value="google_maps">google_maps</option>
                    </select>
                    <input placeholder="URL" value={m.file_url} onChange={(e) => updateList("media", idx, "file_url", e.target.value)} className="flex-1 border px-2 py-1 rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                    <button type="button" onClick={() => removeRow("media", idx)} className="text-red-500 text-sm">✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => addRow("media", emptyMedia)} className="text-blue-600 text-sm">+ {t("geography.addMedia", "Thêm")}</button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t("geography.sources", "Nguồn tham khảo")}</label>
                {form.sources.map((s, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input placeholder={t("geography.sourceTitle", "Tiêu đề")} value={s.title} onChange={(e) => updateList("sources", idx, "title", e.target.value)} className="flex-1 border px-2 py-1 rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                    <input placeholder="URL" value={s.source_url} onChange={(e) => updateList("sources", idx, "source_url", e.target.value)} className="flex-1 border px-2 py-1 rounded text-sm dark:bg-gray-700 dark:border-gray-600" />
                    <button type="button" onClick={() => removeRow("sources", idx)} className="text-red-500 text-sm">✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => addRow("sources", emptySource)} className="text-blue-600 text-sm">+ {t("geography.addSource", "Thêm")}</button>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t dark:border-gray-600">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600">{t("common.cancel")}</button>
              <button onClick={handleSubmit} disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50">{submitting ? t("common.loading") : t("common.save")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
