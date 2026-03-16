import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Palette, X } from "lucide-react";
import { fineArtApi } from "../services/api";

export const FineArtsGallery = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const result = await fineArtApi.getAll(1, 100);
      setImages(result.data || []);
    } catch {
      console.error("Failed to load fine art");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-gray-500 dark:text-gray-400">
        {t("common.loading")}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-400 dark:text-gray-500">
        <Palette className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">{t("heritageList.fineArtsLibrary")}</h3>
        <p>{t("heritageList.noFineArts")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((item) => {
          const metadata = [item.author, item.created_date]
            .filter(Boolean)
            .join(" · ");

          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg shadow hover:shadow-lg transition cursor-pointer bg-white dark:bg-gray-800"
              onClick={() => setSelectedItem(item)}
            >
              {item.fineart_url ? (
                <img
                  src={item.fineart_url}
                  alt={item.title || "fine art"}
                  className="w-full h-48 object-cover hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <Palette className="w-12 h-12 text-gray-400" />
                </div>
              )}
              {metadata && (
                <div className="p-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {metadata}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-200"
            >
              <X size={32} />
            </button>
            {selectedItem.fineart_url && (
              <img
                src={selectedItem.fineart_url}
                alt={selectedItem.title || "preview"}
                className="w-full max-h-[70vh] object-contain bg-black"
              />
            )}
            <div className="p-4 text-gray-900 dark:text-gray-100">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedItem.author && `${t("fineart.author", "Tác giả")}: ${selectedItem.author}`}
                {selectedItem.created_date && ` · ${t("fineart.createdDate", "Ngày tạo")}: ${selectedItem.created_date}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
