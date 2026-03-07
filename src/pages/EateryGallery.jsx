import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, MapPin, UtensilsCrossed } from "lucide-react";
import eateriesData from "../data/eateries.json";

export default function EateryGallery() {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState(null);

  const items = eateriesData;

  if (items.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-gray-400">
        <UtensilsCrossed className="w-14 h-14 mb-3 opacity-50" />
        <p>{t("eatery.noData", "Chưa có dữ liệu quán ăn")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="h-40 w-full object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 line-clamp-2">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {item.commune || item.address}
              </p>
              {item.googleMapsUrl && (
                <a
                  href={item.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#0077D4] dark:text-blue-400 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{t("eatery.viewOnMap", "Xem bản đồ")}</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl relative border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 z-10"
              aria-label={t("common.close", "Đóng")}
            >
              <X className="w-5 h-5" />
            </button>

            {selectedItem.image && (
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-48 object-cover rounded-t-xl"
              />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 pr-10">
                {selectedItem.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span>{selectedItem.address || selectedItem.commune}</span>
                {selectedItem.googleMapsUrl && (
                  <a
                    href={selectedItem.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#0077D4] dark:text-blue-400 hover:underline font-medium"
                  >
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    {t("eatery.viewOnMap", "Xem trên Google Maps")}
                  </a>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {selectedItem.information}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
