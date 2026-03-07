import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
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
  Calendar,
  BookOpen
} from 'lucide-react';

// Import initial data
import { PEOPLE_DATA as initialPeopleData } from '../../data/people.jsx';

const STORAGE_KEY = 'heritage_admin_people';

export default function PeopleManager({ onBack }) {
  const { t } = useTranslation();
  const [people, setPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load people from localStorage or use initial data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPeople(JSON.parse(stored));
      } catch {
        setPeople(initialPeopleData || []);
      }
    } else {
      setPeople(initialPeopleData || []);
    }
  }, []);

  // Save to localStorage whenever people change
  const savePeople = (newPeople) => {
    setPeople(newPeople);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPeople));
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter people based on search
  const filteredPeople = people.filter(person => {
    const searchLower = searchQuery.toLowerCase();
    return (
      person.name?.toLowerCase().includes(searchLower) ||
      person.address?.toLowerCase().includes(searchLower) ||
      person.role?.toLowerCase().includes(searchLower) ||
      person.information?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);
  const paginatedPeople = filteredPeople.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle create new
  const handleCreate = () => {
    setFormData({
      id: Date.now(),
      name: '',
      address: '',
      birthYear: '',
      deathYear: '',
      role: '',
      information: '',
      achievements: '',
      image: ''
    });
    setIsCreating(true);
    setIsEditing(false);
  };

  // Handle edit
  const handleEdit = (person) => {
    setFormData({ ...person });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Handle delete
  const handleDelete = (person) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      const newPeople = people.filter(p => p.id !== person.id);
      savePeople(newPeople);
      showNotification(t('admin.deleteSuccess'));
    }
  };

  // Handle save
  const handleSave = () => {
    if (!formData.name) {
      showNotification(t('admin.errPeopleName'), 'error');
      return;
    }

    let newPeople;
    if (isCreating) {
      newPeople = [...people, formData];
    } else {
      newPeople = people.map(p => p.id === formData.id ? formData : p);
    }

    savePeople(newPeople);
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
  };

  // Handle form change
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-heritage-cream-50 dark:bg-gray-900 theme-transition">
      {/* Header */}
      <div className="bg-gradient-to-r from-heritage-red-800 via-heritage-red-700 to-heritage-red-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-heritage-red-600/50 dark:bg-gray-600/50 hover:bg-heritage-red-600 dark:hover:bg-gray-600 transition-all border border-heritage-gold-400/30 dark:border-gray-500/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">{t('common.back')}</span>
            </button>
            <div>
              <h1 className="text-2xl font-display font-bold">{t('admin.peopleManagement')}</h1>
              <p className="text-heritage-gold-300 dark:text-gray-400 text-sm">{t('admin.descPeople')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
          <div className="w-10 h-10 rounded-xl bg-heritage-gold-100 dark:bg-heritage-gold-900/30 flex items-center justify-center">
            <Users className="w-5 h-5 text-heritage-gold-600 dark:text-heritage-gold-400" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-heritage-earth-900 dark:text-gray-100">
              {t('admin.peopleManagement')}
            </h2>
            <p className="text-sm text-heritage-earth-600 dark:text-gray-400">
              {filteredPeople.length} nhân vật
            </p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-heritage-gold-600 dark:bg-heritage-gold-700 text-white rounded-xl hover:bg-heritage-gold-700 dark:hover:bg-heritage-gold-600 transition-colors shadow-lg"
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
          placeholder="Tìm kiếm nhân vật..."
          className="w-full pl-12 pr-4 py-3 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-gold-500 focus:border-heritage-gold-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      {/* Edit/Create Form */}
      {(isEditing || isCreating) && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 p-6 theme-transition">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-bold text-heritage-earth-900 dark:text-gray-100">
              {isCreating ? 'Thêm nhân vật mới' : 'Chỉnh sửa nhân vật'}
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
                Tên nhân vật *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleFormChange('name', e.target.value)}
                className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-gold-500 focus:border-heritage-gold-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Nhập tên nhân vật"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                <MapPin className="inline w-4 h-4 mr-1" />
                Quê quán
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => handleFormChange('address', e.target.value)}
                className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-gold-500 focus:border-heritage-gold-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Nhập quê quán"
              />
            </div>

            {/* Birth Year */}
            <div>
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                <Calendar className="inline w-4 h-4 mr-1" />
                Năm sinh
              </label>
              <input
                type="text"
                value={formData.birthYear || ''}
                onChange={(e) => handleFormChange('birthYear', e.target.value)}
                className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-gold-500 focus:border-heritage-gold-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="VD: 1890"
              />
            </div>

            {/* Death Year */}
            <div>
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                Năm mất
              </label>
              <input
                type="text"
                value={formData.deathYear || ''}
                onChange={(e) => handleFormChange('deathYear', e.target.value)}
                className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-gold-500 focus:border-heritage-gold-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="VD: 1975"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                <BookOpen className="inline w-4 h-4 mr-1" />
                Vai trò / Chức vụ
              </label>
              <input
                type="text"
                value={formData.role || ''}
                onChange={(e) => handleFormChange('role', e.target.value)}
                className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-gold-500 focus:border-heritage-gold-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="VD: Nhà cách mạng"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                URL hình ảnh
              </label>
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => handleFormChange('image', e.target.value)}
                className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-gold-500 focus:border-heritage-gold-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="https://..."
              />
            </div>

            {/* Information */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                Tiểu sử
              </label>
              <textarea
                value={formData.information || ''}
                onChange={(e) => handleFormChange('information', e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-gold-500 focus:border-heritage-gold-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Nhập tiểu sử nhân vật..."
              />
            </div>

            {/* Achievements */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                Thành tựu / Đóng góp
              </label>
              <textarea
                value={formData.achievements || ''}
                onChange={(e) => handleFormChange('achievements', e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-gold-500 focus:border-heritage-gold-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Liệt kê các thành tựu..."
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
              className="flex items-center gap-2 px-6 py-2 bg-heritage-gold-600 dark:bg-heritage-gold-700 text-white rounded-xl hover:bg-heritage-gold-700 dark:hover:bg-heritage-gold-600 transition-colors"
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
                  Tên nhân vật
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-heritage-earth-700 dark:text-gray-300 hidden md:table-cell">
                  Quê quán
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-heritage-earth-700 dark:text-gray-300 hidden sm:table-cell">
                  Vai trò
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-heritage-earth-700 dark:text-gray-300 hidden lg:table-cell">
                  Năm sinh
                </th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-heritage-earth-700 dark:text-gray-300">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedPeople.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-heritage-earth-500 dark:text-gray-400">
                    {searchQuery ? 'Không tìm thấy nhân vật phù hợp' : t('admin.noData')}
                  </td>
                </tr>
              ) : (
                paginatedPeople.map((person, index) => (
                  <tr
                    key={person.id || index}
                    className="border-b border-heritage-earth-100 dark:border-gray-700 hover:bg-heritage-cream-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-heritage-earth-900 dark:text-gray-100 line-clamp-1">
                        {person.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-sm text-heritage-earth-600 dark:text-gray-400 line-clamp-1">
                        {person.address}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-heritage-gold-100 dark:bg-heritage-gold-900/30 text-heritage-gold-700 dark:text-heritage-gold-300">
                        {person.role || 'Chưa xác định'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-heritage-earth-600 dark:text-gray-400">
                        {person.birthYear || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(person)}
                          className="p-2 hover:bg-heritage-gold-100 dark:hover:bg-heritage-gold-900/30 rounded-lg transition-colors text-heritage-gold-600 dark:text-heritage-gold-400"
                          title={t('admin.editItem')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(person)}
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
