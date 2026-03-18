import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, UtensilsCrossed, X } from "lucide-react";
import quananData from "../data/quanan.json";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80";

export default function QuanAnGallery() {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState(null);

  const items = [...quananData].sort((a, b) => a.so_thu_tu - b.so_thu_tu);

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = FALLBACK_IMAGE;
  };

  const openDetail = (item) => setSelectedItem(item);
  const closeDetail = () => setSelectedItem(null);

  const handleCardKeyDown = (event, item) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetail(item);
    }
  };

  if (items.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-gray-400">
        <UtensilsCrossed className="w-14 h-14 mb-3 opacity-50" />
        <p>{t("quanan.noData")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <article
            key={item.so_thu_tu}
            role="button"
            tabIndex={0}
            onClick={() => openDetail(item)}
            onKeyDown={(event) => handleCardKeyDown(event, item)}
            className="group cursor-pointer text-left bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-lg transition overflow-hidden border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0077D4] focus:ring-offset-2 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900"
          >
            <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={item.link_anh_quan || FALLBACK_IMAGE}
                alt={item.ten_quan}
                onError={handleImageError}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-[#0077D4] dark:group-hover:text-blue-400 transition-colors">
                {item.ten_quan}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 min-h-[60px]">
                {item.mo_ta_quan}
              </p>

              <a
                href={item.link_google_maps}
                target="_blank"
                rel="noreferrer noopener"
                onClick={(event) => event.stopPropagation()}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#0077D4] dark:text-blue-400 hover:underline"
              >
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{t("quanan.viewOnMap")}</span>
              </a>
            </div>
          </article>
        ))}
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeDetail}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quanan-detail-title"
            className="bg-white dark:bg-gray-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl relative border border-gray-200 dark:border-gray-700"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeDetail}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 z-10"
              aria-label={t("quanan.close")}
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedItem.link_anh_quan || FALLBACK_IMAGE}
              alt={selectedItem.ten_quan}
              onError={handleImageError}
              className="w-full h-56 object-cover rounded-t-xl"
            />

            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0077D4] dark:text-blue-400 mb-2">
                {t("quanan.detailTitle")}
              </p>
              <h2
                id="quanan-detail-title"
                className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 pr-10"
              >
                {selectedItem.ten_quan}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {selectedItem.mo_ta_quan}
              </p>

              <a
                href={selectedItem.link_google_maps}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#0077D4] dark:text-blue-400 hover:underline"
              >
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{t("quanan.viewOnMap")}</span>
              </a>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={closeDetail}
                  className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white transition-colors"
                >
                  {t("quanan.close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
