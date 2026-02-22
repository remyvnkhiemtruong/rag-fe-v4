import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fineArtApi } from "../../services/api";

export default function FineArtManagement() {
  const { t } = useTranslation();
  const [fineArtList, setFineArtList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFineArt();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  const fetchFineArt = async () => {
    try {
      setLoading(true);
      const result = await fineArtApi.adminGetAll(1, 100);
      setFineArtList(result.data || []);
    } catch (err) {
      console.error('FineArtManagement fetch error:', err);
      const msg = err?.message ? `${t('admin.loadError')}\n${err.message}` : t('admin.loadError');
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDeleteImage'))) return;

    try {
      await fineArtApi.delete(id);
      fetchFineArt();
    } catch {
      alert(t('admin.errGeneric'));
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      alert(t('admin.pleaseSelectOneImage'));
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("fineart", file);
      });

      await fineArtApi.create(formData);

      setShowModal(false);
      setSelectedFiles([]);
      fetchFineArt();
    } catch {
      alert(t('admin.errGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{t('admin.fineArtManagement')}</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          + Add Images
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">{t('common.loading')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fineArtList.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-600 rounded p-3 shadow-sm bg-white dark:bg-gray-800"
            >
              <img
                src={item.fineart_url}
                alt="fine art"
                className="w-full h-48 object-cover rounded mb-3"
              />

              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm dark:bg-red-600 dark:hover:bg-red-700"
              >
                {t('admin.deleteItem')}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded w-full max-w-lg border border-gray-200 dark:border-gray-600 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Upload Multiple Images
            </h3>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4 text-gray-600 dark:text-gray-300 file:mr-2 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 dark:file:bg-gray-700 file:text-blue-700 dark:file:text-blue-300"
            />

            {selectedFiles.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {selectedFiles.length} file(s) selected
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50"
              >
                {submitting ? t('common.loading') : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
