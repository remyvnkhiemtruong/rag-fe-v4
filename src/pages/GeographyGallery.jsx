import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Globe2 } from "lucide-react";
import { geographyApi } from "../services/api";

const PAGE_SIZE = 9;

export const GeographyGallery = () => {
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isActive = true;

    const fetchList = async () => {
      try {
        setIsLoading(true);

        const res = await geographyApi.getAll(page, PAGE_SIZE);
        if (!isActive) return;

        setItems(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
      } catch (e) {
        console.error(e);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchList();

    return () => {
      isActive = false;
    };
  }, [page]);

  const fetchDetail = async (id) => {
    try {
      setDetailLoading(true);
      const res = await geographyApi.getById(id);
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
        <Globe2 className="w-14 h-14 mb-3 opacity-50" />
        <p>{t("geography.noData", "ChÆ°a cÃ³ dá»¯ liá»‡u Ä‘á»‹a lÃ½")}</p>
      </div>
    );
  }

  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 text-sm rounded border disabled:opacity-40"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-full text-sm transition ${
                p === page
                  ? "bg-blue-600 text-white"
                  : "border hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 text-sm rounded border disabled:opacity-40"
        >
          Next
        </button>
      </div>
    );
  };

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
              <p className="text-sm text-gray-500">{item.region}</p>
            </div>
          </div>
        ))}
      </div>

      <Pagination />

      {detail && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg p-6 relative">
            <button
              onClick={() => {
                setDetail(null);
              }}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            {detailLoading || !detail ? (
              <div className="text-center py-20">{t("common.loading")}</div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">{detail.title}</h2>

                <p className="text-sm text-gray-500 mb-4">{detail.region}</p>

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
                      {t("geography.terrain", "Äá»‹a hÃ¬nh")}:
                    </span>{" "}
                    {detail.terrain}
                  </div>
                  <div>
                    <span className="font-semibold">
                      {t("geography.area", "Diá»‡n tÃ­ch")}:
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
