import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Grid, List, MapPin, Landmark, RotateCcw, Calendar, ChevronRight, ChevronsRight, Filter, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { HeritageDetailModal } from '../components/Detail';
import { MusicGallery } from './MusicGallery';
import { FineArtsGallery } from './FineArtGallery';
import { heritageApi } from '../services/api';
import EconomicGallery from './EconomicGallery';
import GeographyGallery from './GeographyGallery';
import LiteratureGallery from './LiteratureGallery';

const getItemCommune = (item) => item.commune || '';

export const getCategoryBadgeStyle = (category) => {
  switch (category) {
    case 'di_san': return 'bg-blue-600 text-white';
    case 'di_tich': return 'bg-emerald-600 text-white';
    case 'cong_trinh_nghe_thuat': return 'bg-purple-600 text-white';
    case 'kinh_te': return 'bg-amber-600 text-white';
    case 'dia_ly': return 'bg-teal-600 text-white';
    case 'van_hoc': return 'bg-rose-600 text-white';
    default: return 'bg-gray-600 text-white';
  }
};

/** Shared category label for i18n; use with t from useTranslation(). Exported for Detail and others. */
export function formatCategoryLabel(value, t) {
  if (!t) return value;
  switch (value) {
    case 'di_san': return t('heritageList.categoryDiSan');
    case 'di_tich': return t('heritageList.categoryDiTich');
    case 'cong_trinh_nghe_thuat': return t('heritageList.categoryCongTrinh');
    case 'kinh_te': return t('heritageList.categoryKinhTe');
    case 'dia_ly': return t('heritageList.categoryDiaLy');
    case 'van_hoc': return t('heritageList.categoryVanHoc');
    default: return value;
  }
}

function useCategoryLabel(t) {
  return (value) => formatCategoryLabel(value, t);
}

// --- Component ---
export default function HeritageListPage() {
  const { t, i18n } = useTranslation();
  const formatCategoryLabel = useCategoryLabel(t);
  const lang = i18n.language || 'vi';

  const [filters, setFilters] = useState({ ranking: '', type: '', commune: '', category: '' });
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('heritage');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [heritageData, setHeritageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });

  const navTabs = [
    { key: 'heritage', labelKey: 'heritageList.tabHeritage' },
    { key: 'music', labelKey: 'heritageList.tabMusic' },
    { key: 'finearts', labelKey: 'heritageList.tabFineArts' },
    { key: 'kinh_te', labelKey: 'heritageList.tabKinhTe' },
    { key: 'dia_ly', labelKey: 'heritageList.tabDiaLy' },
    { key: 'van_hoc', labelKey: 'heritageList.tabVanHoc' },
  ];

  const isHeritageTab = ['heritage', 'kinh_te', 'dia_ly', 'van_hoc'].includes(activeTab);

  const handleCloseModal = () => setSelectedItem(null);

  useEffect(() => {
    if (isHeritageTab) {
      const fetchHeritageData = async () => {
        try {
          setLoading(true);
          setError(null);
          const result = await heritageApi.getAll(lang, pagination.page, pagination.limit);
          setHeritageData(result.data || []);
          setPagination(prev => ({ ...prev, total: result.pagination?.total ?? 0, totalPages: result.pagination?.totalPages ?? 0 }));
        } catch (err) {
          setError(err?.message?.toLowerCase().includes('not found') ? 'errors.notFound' : 'errors.unknown');
        } finally {
          setLoading(false);
        }
      };
      fetchHeritageData();
    }
  }, [pagination.page, pagination.limit, activeTab, lang]);

  const filteredData = useMemo(() => {
    const categoryFromTab = ['kinh_te', 'dia_ly', 'van_hoc'].includes(activeTab) ? activeTab : null;
    return heritageData.filter(item => {
      const matchesRanking = !filters.ranking || item.ranking_type === filters.ranking;
      const categoryFilter = categoryFromTab || filters.category;
      const matchesCategory = !categoryFilter || item.category === categoryFilter;
      const itemCommune = getItemCommune(item);
      const matchesCommune = !filters.commune || itemCommune.toLowerCase().includes(filters.commune.toLowerCase());
      const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRanking && matchesCategory && matchesCommune && matchesSearch;
    });
  }, [heritageData, filters, searchQuery, activeTab]);

  const availableCommunes = useMemo(() => Array.from(new Set(heritageData.map(getItemCommune).filter(Boolean))).sort(), [heritageData]);
  const availableRankings = useMemo(() => Array.from(new Set(heritageData.map(i => i.ranking_type).filter(Boolean))).sort(), [heritageData]);
  const availableCategories = useMemo(() => Array.from(new Set(heritageData.map(i => i.category).filter(Boolean))), [heritageData]);

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => { setFilters({ ranking: '', type: '', category: '', commune: '' }); setSearchQuery(''); };

  const PaginationControl = () => (
    <div className="flex items-center justify-center">
      {[1, 2, 3].map(num => (
        <button
          key={num}
          onClick={() => setPagination(prev => ({ ...prev, page: num }))}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all ${pagination.page === num
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200 font-bold shadow-md'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
            }`}
        >
          {num}
        </button>
      ))}
      <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        <ChevronRight size={18} />
      </button>
      <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        <ChevronsRight size={18} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 theme-transition">

      {/* 1. Header Title Section */}
      <div className="max-w-[1400px] mx-auto px-4 pt-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 tracking-tight">{t('heritageList.title')}</h1>

        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 dark:border-gray-700 pb-0 gap-4 mb-4">
          <div className="flex items-center gap-8 -mb-[1px]">
            {navTabs.map(({ key, labelKey }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-4 text-[15px] font-medium transition-all relative ${activeTab === key
                    ? 'text-[#0077D4] dark:text-blue-400 font-bold border-b-[3px] border-[#0077D4] dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-[#0077D4] dark:hover:text-blue-400 border-b-[3px] border-transparent'
                  }`}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>

          {isHeritageTab && (
            <div className="flex items-center gap-3 pb-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('heritageList.searchPlaceholder')}
                  className="pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-full focus:border-[#0077D4] dark:focus:border-blue-400 focus:ring-1 focus:ring-[#0077D4] dark:focus:ring-blue-400 outline-none w-48 transition-all focus:w-64"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all border ${isFilterOpen
                    ? 'bg-[#0077D4] text-white border-[#0077D4]'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
              >
                {isFilterOpen ? <X size={16} /> : <Filter size={16} />}
                <span>{t('heritageList.filter')}</span>
              </button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {isFilterOpen && isHeritageTab && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
            >
              <div className="py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { labelKey: 'heritageList.filterLocation', value: filters.commune, key: 'commune', options: availableCommunes, display: (v) => v },
                  { labelKey: 'heritageList.filterLevel', value: filters.ranking, key: 'ranking', options: availableRankings, display: (v) => v },
                  { labelKey: 'heritageList.filterCategory', value: filters.category, key: 'category', options: availableCategories, display: formatCategoryLabel }
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">{t(field.labelKey)}</label>
                    <div className="relative">
                      <select
                        value={field.value}
                        onChange={(e) => handleFilterChange(field.key, e.target.value)}
                        className="w-full p-2.5 pl-3 pr-8 text-sm border border-gray-200 rounded-lg bg-white focus:border-[#0077D4] focus:ring-1 focus:ring-[#0077D4] outline-none appearance-none cursor-pointer hover:border-gray-300 transition-colors"
                      >
                        <option value="">{t('heritageList.all')}</option>
                        {field.options.map(opt => <option key={opt} value={opt}>{field.display(opt)}</option>)}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-200 dark:hover:border-red-800 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4" /> {t('heritageList.resetFilter')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isHeritageTab && (
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {t('heritageList.showResults', { count: filteredData.length })}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="scale-90 origin-right">
                <PaginationControl />
              </div>
              <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-600 mx-2"></div>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow text-[#0077D4] dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}><Grid size={18} /></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow text-[#0077D4] dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}><List size={18} /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-4 pb-20">
        <main>
          {isHeritageTab && (
            <>
              {loading ? (
                <div className="text-center py-20"><p>{t('heritageList.loading')}</p></div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-1'}`}
                  >
                    {filteredData.map(item => (
                      <motion.div
                        layout
                        key={item.id}
                        className="group bg-white dark:bg-gray-800 rounded-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative"
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <img
                            src={item.image_url || 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800'}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-3 left-3 bg-[#1EC6B6]/90 backdrop-blur-sm text-white px-3 py-1 rounded text-xs font-bold shadow-sm">
                            {item.ranking_type}
                          </div>
                          {item.category && (
                            <div className={`absolute top-3 right-3 px-3 py-1 rounded text-xs font-bold shadow-sm backdrop-blur-sm ${getCategoryBadgeStyle(item.category)}`}>
                              {formatCategoryLabel(item.category)}
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="text-base font-bold text-gray-800 mb-2 leading-tight group-hover:text-[#0077D4] transition-colors line-clamp-2 min-h-[40px]">
                            {item.name}
                          </h3>
                          <div className="space-y-1.5">
                            <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400 text-xs">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1">{item.commune}, {item.district}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                              <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                              <span>{t('heritageList.yearRanked')}: {item.year_ranked || t('heritageList.na')}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </>
          )}

          {activeTab === 'music' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <MusicGallery />
            </motion.div>
          )}

          {activeTab === 'finearts' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <FineArtsGallery />
            </motion.div>
          )}

          {activeTab === 'kinh_te' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <EconomicGallery />
            </motion.div>
          )}
          {activeTab === 'dia_ly' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <GeographyGallery />
            </motion.div>
          )}
          {activeTab === 'van_hoc' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <LiteratureGallery />
            </motion.div>
          )}
        </main>
      </div>

      {selectedItem && (
        <HeritageDetailModal
          itemId={selectedItem.id}
          initialItem={selectedItem}
          onClose={handleCloseModal}
          language={lang}
        />
      )}
    </div>
  );
}