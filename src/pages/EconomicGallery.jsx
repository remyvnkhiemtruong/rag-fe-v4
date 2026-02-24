import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, BarChart3 } from "lucide-react";
import { economicsApi } from "../services/api";

export const EconomicGallery = () => {
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
      const res = await economicsApi.getAll(1, 10);
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
      const res = await economicsApi.getById(id);
      setDetail(res);
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  };

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
        <BarChart3 className="w-14 h-14 mb-3 opacity-50" />
        <p>{t("economic.noData", "Chưa có dữ liệu kinh tế")}</p>
      </div>
    );
  }

  return (
    <>
      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const thumb = item.media?.[0]?.file_url;

          return (
            <div
              key={item.id}
              onClick={() => fetchDetail(item.id)}
              className="cursor-pointer bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-lg transition"
            >
              {thumb && (
                <img
                  src={thumb}
                  alt={item.title}
                  className="h-40 w-full object-cover rounded-t-lg"
                />
              )}

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.sector}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      {detail && !isLoading && (
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
                  {detail.sector}
                </p>

                <p className="mb-4">{detail.content}</p>

                {detail.analysis_text && (
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
                    {detail.analysis_text}
                  </div>
                )}

                {detail.distributions?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">
                      Cơ cấu
                    </h4>
                    {detail.distributions.map(d => (
                      <div
                        key={d.id}
                        className="flex justify-between text-sm"
                      >
                        <span>{d.component_name}</span>
                        <span>{d.percentage}%</span>
                      </div>
                    ))}
                  </div>
                )}

                {detail.media?.[0] && (
                  <img
                    src={detail.media[0].file_url}
                    alt="economic"
                    className="rounded-lg"
                  />
                )}

                {detail.source && (
                  <p className="text-xs italic mt-4 text-gray-500">
                    Nguồn: {detail.source}
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

export default EconomicGallery;