import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Globe2 } from "lucide-react";
import { geographyApi } from "../services/api";

export const GeographyGallery = () => {
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      setIsLoading(true);
      const res = await geographyApi.getAll(1, 10);
      setItems(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDetail = async (id) => {
    try {
      setDetailLoading(true);
      setSelectedId(id);
      const res = await geographyApi.getById(id);
      setDetail(res);
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  };

  /* =====================
     LOADING / EMPTY
  ====================== */
  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        {t("common.loading")}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-gray-400">
        <Globe2 className="w-14 h-14 mb-3 opacity-50" />
        <p>{t("geography.noData", "Chưa có dữ liệu địa lý")}</p>
      </div>
    );
  }

  /* =====================
     LIST
  ====================== */
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => fetchDetail(item.id)}
            className="cursor-pointer bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-lg transition"
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.title}
                className="h-40 w-full object-cover rounded-t-lg"
              />
            )}

            <div className="p-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">
                {item.region}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* =====================
          DETAIL MODAL
      ====================== */}
      {detail && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg p-6 relative">
            <button
              onClick={() => {
                setSelectedId(null);
                setDetail(null);
              }}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            {detailLoading || !detail ? (
              <div className="text-center py-20">
                {t("common.loading")}
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">
                  {detail.title}
                </h2>

                <p className="text-sm text-gray-500 mb-4">
                  {detail.region}
                </p>

                {detail.image_url && (
                  <img
                    src={detail.image_url}
                    alt={detail.title}
                    className="rounded-lg mb-4"
                  />
                )}

                <div className="grid grid-cols-2 gap-4 text-sm mb-4 text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-semibold">
                      {t("geography.terrain", "Địa hình")}:
                    </span>{" "}
                    {detail.terrain}
                  </div>
                  <div>
                    <span className="font-semibold">
                      {t("geography.area", "Diện tích")}:
                    </span>{" "}
                    {detail.area}
                  </div>
                </div>

                <p className="mb-4 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {detail.content}
                </p>

                {detail.created_at && (
                  <p className="text-xs italic text-gray-500">
                    {new Date(detail.created_at).toLocaleDateString()}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GeographyGallery;