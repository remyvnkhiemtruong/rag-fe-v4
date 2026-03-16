import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Music } from "lucide-react";
import { musicApi } from "../services/api";

const API_BASE = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/api\/?$/, "");

export const MusicGallery = () => {
  const { t } = useTranslation();
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMusic, setSelectedMusic] = useState(null);

  useEffect(() => {
    fetchMusic();
  }, []);

  const fetchMusic = async () => {
    try {
      const result = await musicApi.getAll(1, 50);
      setMusicList(result.data || []);
    } catch (err) {
      console.error("Failed to load music", err);
    } finally {
      setLoading(false);
    }
  };

  const getVideoId = (url) => {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1);
      if (parsed.hostname.includes("youtube.com")) return parsed.searchParams.get("v");
    } catch {
      return null;
    }
    return null;
  };

  const getThumbnail = (url) => {
    const id = getVideoId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  };

  const getEmbedUrl = (url) => {
    const id = getVideoId(url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  };

  const audioUrl = (music) => {
    const u = music.mp3_url;
    if (!u) return null;
    return u.startsWith("http") ? u : API_BASE + u;
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">{t("common.loading")}</p>
      </div>
    );
  }

  if (musicList.length === 0) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-400 dark:text-gray-500">
        <Music className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">{t("heritageList.musicLibrary")}</h3>
        <p>{t("heritageList.noMusic")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {musicList.map((music) => {
          const metadata = [music.author, music.performer, music.year_signed]
            .filter(Boolean)
            .join(" - ");

          return (
            <div
              key={music.id}
              className="cursor-pointer group"
              onClick={() => setSelectedMusic(music)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-md bg-white dark:bg-gray-800">
                {music.source_type === "mp3" && music.mp3_url ? (
                  <div className="w-full h-48 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 p-4">
                    <Music className="w-14 h-14 text-gray-400 dark:text-gray-500 mb-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t("music.audio")}</span>
                  </div>
                ) : (
                  <img
                    src={getThumbnail(music.youtube_url) || ""}
                    alt=""
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Music className="w-12 h-12 text-white" />
                </div>
                {metadata && (
                  <div className="p-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {metadata}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedMusic && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl p-4 relative border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setSelectedMusic(null)}
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white z-10"
            >
              x
            </button>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 pr-8">
              {selectedMusic.title || t("music.untitled")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {selectedMusic.author && `${t("music.author")}: ${selectedMusic.author}`}
              {selectedMusic.performer && ` - ${t("music.performer")}: ${selectedMusic.performer}`}
              {selectedMusic.year_signed && ` - ${selectedMusic.year_signed}`}
            </p>

            {selectedMusic.source_type === "mp3" && audioUrl(selectedMusic) ? (
              <audio
                controls
                className="w-full"
                src={audioUrl(selectedMusic)}
              >
                {t("literature.audioNotSupported")}
              </audio>
            ) : getEmbedUrl(selectedMusic.youtube_url) ? (
              <iframe
                src={getEmbedUrl(selectedMusic.youtube_url)}
                title={t("heritageList.musicLibrary")}
                className="w-full h-[500px] rounded"
                allowFullScreen
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 py-8 text-center">{t("music.noSource")}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
