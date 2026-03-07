import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { musicApi } from "../../services/api";

export default function MusicManagement() {
  const { t } = useTranslation();
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newLinks, setNewLinks] = useState([""]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMusic();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  const fetchMusic = async () => {
    try {
      setLoading(true);
      const result = await musicApi.adminGetAll(1, 100);
      setMusicList(result.data || []);
    } catch {
      alert(t('admin.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDeleteMusic'))) return;

    try {
      await musicApi.delete(id);
      fetchMusic();
    } catch {
      alert(t('admin.deleteFailed'));
    }
  };

  const handleAddInput = () => {
    setNewLinks([...newLinks, ""]);
  };

  const handleChange = (index, value) => {
    const updated = [...newLinks];
    updated[index] = value;
    setNewLinks(updated);
  };

  const handleRemoveInput = (index) => {
    const updated = newLinks.filter((_, i) => i !== index);
    setNewLinks(updated);
  };

  const handleSubmit = async () => {
    const filteredLinks = newLinks
      .map((l) => l.trim())
      .filter((l) => l !== "");

    if (filteredLinks.length === 0) {
      alert(t('admin.pleaseEnterOneLink'));
      return;
    }

    try {
      setSubmitting(true);
      await musicApi.create(filteredLinks);
      setShowModal(false);
      setNewLinks([""]);
      fetchMusic();
    } catch {
      alert(t('admin.errGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  const getEmbedUrl = (url) => {
    try {
      const parsed = new URL(url);

      if (parsed.hostname.includes("youtu.be")) {
        const id = parsed.pathname.slice(1);
        return `https://www.youtube.com/embed/${id}`;
      }

      if (parsed.hostname.includes("youtube.com")) {
        const id = parsed.searchParams.get("v");
        return `https://www.youtube.com/embed/${id}`;
      }

      return null;
    } catch {
      return null;
    }
  };

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{t('admin.musicManagement')}</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          + {t('admin.addMusic')}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">{t('common.loading')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {musicList.map((music) => (
            <div
              key={music.id}
              className="border border-gray-200 dark:border-gray-600 rounded p-4 shadow-sm bg-white dark:bg-gray-800"
            >
              <iframe
                className="w-full h-48 rounded mb-3"
                src={getEmbedUrl(music.youtube_url)}
                title="music"
                allowFullScreen
              />
              <p className="text-sm break-all mb-2 text-gray-600 dark:text-gray-300">
                {music.youtube_url}
              </p>
              <button
                onClick={() => handleDelete(music.id)}
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
              {t('admin.addMultipleMusicLinks')}
            </h3>

            <div className="space-y-3">
              {newLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('admin.placeholderYoutubeLink')}
                    value={link}
                    onChange={(e) =>
                      handleChange(index, e.target.value)
                    }
                    className="flex-1 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  {newLinks.length > 1 && (
                    <button
                      onClick={() => handleRemoveInput(index)}
                      className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleAddInput}
              className="mt-3 text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              {t('admin.addAnotherLink')}
            </button>

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
                {submitting ? t('common.loading') : t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
