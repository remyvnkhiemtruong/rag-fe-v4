import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTags } from '../../context/TagContext';
import {
  ChevronLeft,
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Tag,
  Check,
  Filter,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function TagManager({ onBack }) {
  const { t } = useTranslation();
  const {
    tags,
    categories,
    addTag,
    updateTag,
    deleteTag,
    getCategoryColorClass,
    resetTags
  } = useTags();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    category: 'topic',
    color: '#ea580c'
  });

  // Predefined colors
  const colorOptions = [
    '#dc2626', '#ea580c', '#d97706', '#16a34a', '#2563eb', '#9333ea',
    '#db2777', '#0891b2', '#059669', '#7c3aed', '#c026d3', '#0d9488'
  ];

  // Filter tags
  const filteredTags = useMemo(() => {
    return tags.filter(tag => {
      const matchesSearch = !searchQuery ||
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tag.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tags, searchQuery, selectedCategory]);

  // Group tags by category
  const tagsByCategory = useMemo(() => {
    const grouped = {};
    categories.forEach(cat => {
      grouped[cat.id] = filteredTags.filter(tag => tag.category === cat.id);
    });
    return grouped;
  }, [filteredTags, categories]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.nameEn.trim()) {
      showNotification(t('admin.fillRequired'), 'error');
      return;
    }

    if (editingTag) {
      updateTag(editingTag.id, formData);
      showNotification(t('admin.tagUpdateSuccess'));
    } else {
      addTag(formData);
      showNotification(t('admin.tagAddSuccess'));
    }

    closeModal();
  };

  // Open modal for new tag
  const openNewTagModal = () => {
    setFormData({
      name: '',
      nameEn: '',
      category: 'topic',
      color: '#ea580c'
    });
    setEditingTag(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (tag) => {
    setFormData({
      name: tag.name,
      nameEn: tag.nameEn,
      category: tag.category,
      color: tag.color
    });
    setEditingTag(tag);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
    setFormData({
      name: '',
      nameEn: '',
      category: 'topic',
      color: '#ea580c'
    });
  };

  // Handle delete
  const handleDelete = (tag) => {
    setDeleteConfirm(tag);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteTag(deleteConfirm.id);
      showNotification(t('admin.tagDeleteSuccess'));
      setDeleteConfirm(null);
    }
  };

  // Handle reset
  const handleReset = () => {
    if (window.confirm(t('admin.confirmResetTags'))) {
      resetTags();
      showNotification(t('admin.tagResetSuccess'));
    }
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
              <Check className="w-5 h-5" />
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <Tag className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-heritage-earth-900 dark:text-gray-100">
                  {t('admin.tagManagement')}
                </h1>
                <p className="text-sm text-heritage-earth-600 dark:text-gray-400">
                  {t('admin.totalTags')}: {tags.length}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">{t('admin.resetTags')}</span>
            </button>
            <button
              onClick={openNewTagModal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>{t('admin.addTag')}</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('admin.searchTag')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-earth-200 dark:border-gray-600 bg-heritage-cream-50 dark:bg-gray-700 text-heritage-earth-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-heritage-earth-200 dark:border-gray-600 bg-heritage-cream-50 dark:bg-gray-700 text-heritage-earth-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              >
                <option value="all">{t('admin.allCategories')}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map(cat => {
            const colorClass = getCategoryColorClass(cat.id);
            const count = tagsByCategory[cat.id]?.length || 0;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
                className={`p-3 rounded-xl border transition-all ${
                  selectedCategory === cat.id
                    ? `${colorClass.bg} ${colorClass.border} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900`
                    : 'bg-white dark:bg-gray-800 border-heritage-earth-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`text-2xl font-bold ${selectedCategory === cat.id ? colorClass.text : 'text-heritage-earth-900 dark:text-gray-100'}`}>
                  {count}
                </div>
                <div className="text-xs text-heritage-earth-600 dark:text-gray-400">{cat.name}</div>
              </button>
            );
          })}
        </div>

        {/* Tags List by Category */}
        <div className="space-y-6">
          {selectedCategory === 'all' ? (
            categories.map(cat => {
              const catTags = tagsByCategory[cat.id];
              if (!catTags || catTags.length === 0) return null;

              const colorClass = getCategoryColorClass(cat.id);

              return (
                <div key={cat.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 overflow-hidden">
                  <div className={`px-4 py-3 ${colorClass.bg} border-b ${colorClass.border}`}>
                    <h3 className={`font-semibold ${colorClass.text}`}>
                      {cat.name} ({catTags.length})
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {catTags.map(tag => (
                        <TagItem
                          key={tag.id}
                          tag={tag}
                          onEdit={() => openEditModal(tag)}
                          onDelete={() => handleDelete(tag)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4">
                {filteredTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {filteredTags.map(tag => (
                      <TagItem
                        key={tag.id}
                        tag={tag}
                        onEdit={() => openEditModal(tag)}
                        onDelete={() => handleDelete(tag)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-heritage-earth-500 dark:text-gray-400">
                    {t('admin.noData')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-4 border-b border-heritage-earth-200 dark:border-gray-700">
                <h3 className="text-lg font-display font-bold text-heritage-earth-900 dark:text-gray-100">
                  {editingTag ? t('admin.editTag') : t('admin.addTagNew')}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {/* Name Vietnamese */}
                <div>
                  <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1">
                    {t('admin.tagName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-heritage-earth-200 dark:border-gray-600 bg-heritage-cream-50 dark:bg-gray-700 text-heritage-earth-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder={t('admin.placeholderTagExample')}
                    required
                  />
                </div>

                {/* Name English */}
                <div>
                  <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1">
                    {t('admin.tagNameEn')} *
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-heritage-earth-200 dark:border-gray-600 bg-heritage-cream-50 dark:bg-gray-700 text-heritage-earth-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder={t('admin.placeholderTagExample')}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1">
                    {t('admin.tagCategory')} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-heritage-earth-200 dark:border-gray-600 bg-heritage-cream-50 dark:bg-gray-700 text-heritage-earth-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name} ({cat.nameEn})</option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-2">
                    {t('admin.tagColor')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-8 h-8 rounded-lg transition-all ${
                          formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg border border-heritage-earth-200 dark:border-gray-600 bg-heritage-cream-50 dark:bg-gray-700 text-heritage-earth-900 dark:text-gray-100 text-sm font-mono"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-2">
                    {t('admin.tagPreview')}
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: formData.color }}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      {formData.name || t('admin.tagName')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-heritage-earth-200 dark:border-gray-600 text-heritage-earth-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white transition-colors"
                  >
                    {editingTag ? t('admin.updateBtn') : t('admin.addNewBtn')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-heritage-earth-900 dark:text-gray-100 mb-2">
                  {t('admin.confirmDeleteTitle')}
                </h3>
                <p className="text-heritage-earth-600 dark:text-gray-400 mb-4">
                  {t('admin.confirmDeleteTag', { name: deleteConfirm.name })}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-heritage-earth-200 dark:border-gray-600 text-heritage-earth-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors"
                  >
                    {t('admin.delete')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Tag Item Component
function TagItem({ tag, onEdit, onDelete }) {
  const { t } = useTranslation();
  return (
    <div
      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white transition-all hover:shadow-md"
      style={{ backgroundColor: tag.color }}
    >
      <Tag className="w-3.5 h-3.5" />
      <span>{tag.name}</span>
      <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
        <button
          onClick={onEdit}
          className="p-0.5 hover:bg-white/20 rounded transition-colors"
          title={t('admin.editItem')}
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="p-0.5 hover:bg-white/20 rounded transition-colors"
          title={t('admin.deleteItem')}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
