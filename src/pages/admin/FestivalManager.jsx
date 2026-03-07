import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PartyPopper,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  MapPin,
  Calendar
} from 'lucide-react';

// Import initial data
import { FESTIVAL_DATA as initialFestivalsData } from '../../data/festivals.jsx';

const STORAGE_KEY = 'heritage_admin_festivals';

export default function FestivalManager({ onBack }) {
  const { t } = useTranslation();
  const [festivals, setFestivals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [, setSelectedFestival] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load festivals from localStorage or use initial data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFestivals(JSON.parse(stored));
      } catch {
        setFestivals(initialFestivalsData || []);
      }
    } else {
      setFestivals(initialFestivalsData || []);
    }
  }, []);

  // Save to localStorage whenever festivals change
  const saveFestivals = (newFestivals) => {
    setFestivals(newFestivals);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFestivals));
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter festivals based on search
  const filteredFestivals = festivals.filter(festival => {
    const searchLower = searchQuery.toLowerCase();
    return (
      festival.name?.toLowerCase().includes(searchLower) ||
      festival.location?.toLowerCase().includes(searchLower) ||
      festival.time?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredFestivals.length / itemsPerPage);
  const paginatedFestivals = filteredFestivals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle create new
  const handleCreate = () => {
    setFormData({
      id: Date.now(),
      name: '',
      location: '',
      time: '',
      description: '',
      image: ''
    });
    setIsCreating(true);
    setIsEditing(false);
    setSelectedFestival(null);
  };

  // Handle edit
  const handleEdit = (festival) => {
    setFormData({ ...festival });
    setIsEditing(true);
    setIsCreating(false);
    setSelectedFestival(festival);
  };

  // Handle delete
  const handleDelete = (festival) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      const newFestivals = festivals.filter(f => f.id !== festival.id);
      saveFestivals(newFestivals);
      showNotification(t('admin.deleteSuccess'));
    }
  };

  // Handle save
  const handleSave = () => {
    if (!formData.name) {
      showNotification(t('admin.errFestivalName'), 'error');
      return;
    }

    let newFestivals;
    if (isCreating) {
      newFestivals = [...festivals, formData];
    } else {
      newFestivals = festivals.map(f => f.id === formData.id ? formData : f);
    }

    saveFestivals(newFestivals);
    showNotification(t('admin.saveSuccess'));
    setIsEditing(false);
    setIsCreating(false);
    setFormData({});
  };

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setFormData({});
    setSelectedFestival(null);
  };

  // Handle form change
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-heritage-cream-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 theme-transition">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
                notification.type === 'success'
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700'
              }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-heritage-cream-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <PartyPopper className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-heritage-earth-900 dark:text-gray-100">
                {t('admin.festivalManagement')}
              </h2>
              <p className="text-sm text-heritage-earth-600 dark:text-gray-400">
                {filteredFestivals.length} lễ hội
              </p>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 dark:bg-emerald-700 text-white rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            {t('admin.addNew')}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-heritage-earth-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.searchFestival')}
            className="w-full pl-12 pr-4 py-3 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Edit/Create Form */}
        {(isEditing || isCreating) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 p-6 theme-transition">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold text-heritage-earth-900 dark:text-gray-100">
                {isCreating ? 'Thêm lễ hội mới' : 'Chỉnh sửa lễ hội'}
              </h3>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-heritage-cream-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-heritage-earth-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                  Tên lễ hội *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Nhập tên lễ hội"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Địa điểm
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Nhập địa điểm"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Thời gian tổ chức
                </label>
                <input
                  type="text"
                  value={formData.time || ''}
                  onChange={(e) => handleFormChange('time', e.target.value)}
                  className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="VD: Tháng 3 âm lịch"
                />
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                  URL hình ảnh
                </label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => handleFormChange('image', e.target.value)}
                  className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="https://..."
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                  Mô tả
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Nhập mô tả về lễ hội..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-heritage-earth-100 dark:border-gray-700">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-heritage-earth-700 dark:text-gray-300 hover:bg-heritage-cream-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 dark:bg-emerald-700 text-white rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                {t('common.save')}
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 overflow-hidden theme-transition">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-heritage-cream-50 dark:bg-gray-700/50 border-b border-heritage-earth-200 dark:border-gray-600">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-heritage-earth-700 dark:text-gray-300">
                    Tên lễ hội
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-heritage-earth-700 dark:text-gray-300 hidden md:table-cell">
                    Địa điểm
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-heritage-earth-700 dark:text-gray-300 hidden sm:table-cell">
                    Thời gian
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-heritage-earth-700 dark:text-gray-300">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedFestivals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-heritage-earth-500 dark:text-gray-400">
                      {searchQuery ? 'Không tìm thấy lễ hội phù hợp' : t('admin.noData')}
                    </td>
                  </tr>
                ) : (
                  paginatedFestivals.map((festival, index) => (
                    <tr
                      key={festival.id || index}
                      className="border-b border-heritage-earth-100 dark:border-gray-700 hover:bg-heritage-cream-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-heritage-earth-900 dark:text-gray-100 line-clamp-1">
                          {festival.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="text-sm text-heritage-earth-600 dark:text-gray-400 line-clamp-1">
                          {festival.location || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-sm text-heritage-earth-600 dark:text-gray-400">
                          {festival.time || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(festival)}
                            className="p-2 hover:bg-heritage-gold-100 dark:hover:bg-heritage-gold-900/30 rounded-lg transition-colors text-heritage-gold-600 dark:text-heritage-gold-400"
                            title={t('admin.editItem')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(festival)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600 dark:text-red-400"
                            title={t('admin.deleteItem')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-heritage-earth-100 dark:border-gray-700">
              <div className="text-sm text-heritage-earth-600 dark:text-gray-400">
                Trang {currentPage} / {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-heritage-cream-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 hover:bg-heritage-cream-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
