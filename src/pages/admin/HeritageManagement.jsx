import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Landmark, Plus, Search, Edit2, Trash2, X, Save,
  ChevronLeft, ChevronRight, AlertCircle, CheckCircle,
  BarChart3, FileText, Eye, Loader2, Upload, Image as ImageIcon,
  Video, Trash, Link as LinkIcon
} from 'lucide-react';
import AnalyticsDashboard from '../../components/admin/AnalyticsDashboard';
import { heritageApi } from '../../services/api';

const rankingTypes = [
  { value: 'Quốc gia đặc biệt', label: 'Quốc gia đặc biệt' },
  { value: 'Quốc gia', label: 'Quốc gia' },
  { value: 'Cấp tỉnh', label: 'Cấp tỉnh' },
  { value: 'Không', label: 'Không xếp hạng' },
];

const heritageCategories = [
  { value: 'di_san', label: 'Di sản' },
  { value: 'di_tich', label: 'Di tích' },
  { value: 'cong_trinh_nghe_thuat', label: 'Công trình nghệ thuật' },
  { value: 'kinh_te', label: 'Kinh tế' },
  { value: 'dia_ly', label: 'Địa lý' },
  { value: 'van_hoc', label: 'Văn học' },
];


const inputLanguages = [
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'km', name: 'ភាសាខ្មែរ (Khmer)' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文 (Hoa)' },
];

export default function HeritageManagement() {
  const { t } = useTranslation();
  const [heritages, setHeritages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHeritage, setSelectedHeritage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [activeTab, setActiveTab] = useState('list');
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);

  // NEW: Gallery and YouTube states
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [youtubeLinks, setYoutubeLinks] = useState(['']);
  const [existingGallery, setExistingGallery] = useState([]); // For edit mode
  const [keepMediaIds, setKeepMediaIds] = useState([]); // IDs to keep during update

  const [image360File, setImage360File] = useState(null);
  const [image360Preview, setImage360Preview] = useState(null);

  const itemsPerPage = 10;

  // Fetch heritages from API
  const fetchHeritages = async (page = 1) => {
    setLoading(true);
    try {
      const result = await heritageApi.adminGetAll(page, itemsPerPage);
      // Backend returns { success: true, data: [...], pagination: {...} }
      if (result.success && result.data) {
        setHeritages(result.data);
        setPagination(result.pagination || { total: 0, totalPages: 1 });
      } else {
        setHeritages([]);
        setPagination({ total: 0, totalPages: 1 });
      }
    } catch (error) {
      console.log(error);
      showNotification('Lỗi khi tải dữ liệu: ' + error.message, 'error');
      setHeritages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeritages(currentPage);
  }, [currentPage]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter heritages based on search (client-side)
  const filteredHeritages = heritages.filter(h => {
    const q = searchQuery.toLowerCase();
    return h.name?.toLowerCase().includes(q) ||
      h.address?.toLowerCase().includes(q) ||
      h.ranking_type?.toLowerCase().includes(q);
  });

  // Handle create new
  const handleCreate = () => {
    setFormData({
      name: '',
      address: '',
      commune: '',
      district: '',
      province: '',
      year_ranked: '',
      ranking_type: 'Cấp tỉnh',
      year_built: '',
      information: '',
      notes: '',
      input_lang: 'vi',
      coordinates: '',
      category: 'di_san',
    });
    setImageFile(null);
    setAudioFile(null);
    setAudioPreview(null);
    setImagePreview(null);

    // NEW: Reset gallery and YouTube
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setYoutubeLinks(['']);
    setExistingGallery([]);
    setKeepMediaIds([]);

    setIsCreating(true);
    setIsEditing(false);
  };

  // Handle edit
  const handleEdit = async (heritage) => {
    setLoading(true);
    try {
      // Fetch full heritage details with gallery and youtube_links
      const result = await heritageApi.adminGetById(heritage.id);
      const fullHeritage = result.success ? result.data : heritage;

      setFormData({
        id: fullHeritage.id,
        name: fullHeritage.name || '',
        address: fullHeritage.address || '',
        commune: fullHeritage.commune || '',
        district: fullHeritage.district || '',
        province: fullHeritage.province || '',
        year_ranked: fullHeritage.year_ranked || '',
        ranking_type: fullHeritage.ranking_type || 'Cấp tỉnh',
        year_built: fullHeritage.year_built || '',
        information: fullHeritage.information || '',
        notes: fullHeritage.notes || '',
        input_lang: fullHeritage.original_lang || 'vi',
        coordinates: fullHeritage.coordinates
          ? JSON.stringify(fullHeritage.coordinates)
          : '',
        category: fullHeritage.category || 'di_san',

      });

      // Backend returns full URLs, use them directly
      setImagePreview(fullHeritage.image_url || null);
      setImageFile(null);
      setImage360Preview(fullHeritage.image360 || null);
      setImage360File(null);
      setAudioPreview(fullHeritage.audio_url || null);
      setAudioFile(null);

      // NEW: Set existing gallery and YouTube links
      setExistingGallery(fullHeritage.gallery || []);
      setKeepMediaIds((fullHeritage.gallery || []).map(img => img.id));
      setGalleryFiles([]);
      setGalleryPreviews([]);
      setYoutubeLinks(
        fullHeritage.youtube_links && fullHeritage.youtube_links.length > 0
          ? fullHeritage.youtube_links.map(link => link.url)
          : ['']
      );

      setSelectedHeritage(fullHeritage);
      setIsEditing(true);
      setIsCreating(false);
    } catch (error) {
      showNotification('Lỗi khi tải chi tiết: ' + error.message, 'error');
      // Fallback to basic data if API call fails
      setFormData({
        id: heritage.id,
        name: heritage.name || '',
        address: heritage.address || '',
        commune: heritage.commune || '',
        district: heritage.district || '',
        province: heritage.province || '',
        year_ranked: heritage.year_ranked || '',
        ranking_type: heritage.ranking_type || 'Cấp tỉnh',
        category: heritage.category || 'di_san',
        year_built: heritage.year_built || '',
        information: heritage.information || '',
        notes: heritage.notes || '',
        input_lang: heritage.original_lang || 'vi',

      });
      setImagePreview(heritage.image_url || null);
      setImage360Preview(fullHeritage.image360 || null);
      setAudioPreview(heritage.audio_url || null);
      setExistingGallery([]);
      setYoutubeLinks(['']);
      setSelectedHeritage(heritage);
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle view
  const handleView = async (heritage) => {
    setLoading(true);
    try {
      // Fetch full details with gallery and youtube_links
      const result = await heritageApi.adminGetById(heritage.id);
      const fullHeritage = result.success ? result.data : heritage;

      setSelectedHeritage(fullHeritage);
      setIsEditing(false);
      setIsCreating(false);
    } catch (error) {
      showNotification('Lỗi khi tải chi tiết: ' + error.message, 'error');
      // Fallback to basic data
      setSelectedHeritage(heritage);
      setIsEditing(false);
      setIsCreating(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
    }
  };

  const handleImage360Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage360File(file);
      setImage360Preview(URL.createObjectURL(file));
    }
  };


  // NEW: Handle gallery images change
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setGalleryFiles(prev => [...prev, ...files]);

      // Create previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // NEW: Remove gallery preview (new upload)
  const removeGalleryPreview = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // NEW: Toggle existing gallery image (for update)
  const toggleExistingGallery = (imageId) => {
    setKeepMediaIds(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  // NEW: Add YouTube link field
  const addYoutubeLink = () => {
    setYoutubeLinks(prev => [...prev, '']);
  };

  // NEW: Remove YouTube link field
  const removeYoutubeLink = (index) => {
    setYoutubeLinks(prev => prev.filter((_, i) => i !== index));
  };

  // NEW: Update YouTube link value
  const updateYoutubeLink = (index, value) => {
    setYoutubeLinks(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Handle save
  const handleSave = async () => {
    if (!formData.name || !formData.address) {
      showNotification('Vui lòng điền đầy đủ tên và địa chỉ!', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('information', formData.information || '');
      data.append('year_built', formData.year_built || '');
      data.append('year_ranked', formData.year_ranked || '');
      data.append('ranking_type', formData.ranking_type || '');
      data.append('category', formData.category || 'di_san');
      data.append('address', formData.address || '');
      data.append('commune', formData.commune || '');
      data.append('district', formData.district || '');
      data.append('province', formData.province || '');
      data.append('notes', formData.notes || '');
      data.append('input_lang', formData.input_lang || 'vi');

      // Main image
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (image360File) {
        data.append('image360', image360File);
      }

      if (formData.coordinates) {
        data.append('coordinates', formData.coordinates);
      }

      // Audio
      if (audioFile) {
        data.append('audio', audioFile);
      }

      // NEW: Gallery images (multiple files with same key name)
      galleryFiles.forEach(file => {
        data.append('gallery', file);
      });

      // NEW: YouTube links (as JSON string)
      const validYoutubeLinks = youtubeLinks.filter(link => link.trim() !== '');
      if (validYoutubeLinks.length > 0) {
        data.append('youtube_links', JSON.stringify(validYoutubeLinks));
      }

      // NEW: For update - send keep_media_ids
      if (isEditing) {
        data.append('keep_media_ids', JSON.stringify(keepMediaIds));
      }

      let result;
      if (isCreating) {
        result = await heritageApi.create(data);
        showNotification(
          result.message || 'Đã thêm di sản mới! Đang dịch và tạo audio...',
          'success'
        );
      } else {
        result = await heritageApi.update(formData.id, data);
        showNotification(
          result.message || 'Đã cập nhật di sản!',
          'success'
        );
      }

      setIsCreating(false);
      setIsEditing(false);
      setSelectedHeritage(null);
      fetchHeritages(currentPage);
    } catch (error) {
      showNotification('Lỗi: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (heritage) => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${heritage.name}"?`)) return;

    setLoading(true);
    try {
      const result = await heritageApi.delete(heritage.id);
      showNotification(
        result.message || 'Đã xóa di sản thành công!',
        'success'
      );
      setSelectedHeritage(null);
      setIsEditing(false);
      fetchHeritages(currentPage);
    } catch (error) {
      showNotification('Lỗi khi xóa: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedHeritage(null);
    setFormData({});
    setImageFile(null);
    setImagePreview(null);
    setAudioFile(null);
    setAudioPreview(null);
    setImage360File(null);
    setImage360Preview(null);


    // NEW: Reset gallery and YouTube
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setYoutubeLinks(['']);
    setExistingGallery([]);
    setKeepMediaIds([]);
  };

  // NEW: Extract YouTube video ID for embedding
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Landmark className="w-8 h-8 text-blue-600" />
                Quản Lý Di Sản Văn Hóa
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tổng số: {pagination.total} di sản
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                  }`}
              >
                <FileText className="w-4 h-4" /> Danh Sách
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                  }`}
              >
                <BarChart3 className="w-4 h-4" /> Phân Tích
              </button>
            </div>
          </div>

          {activeTab === 'list' && (
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Thêm Mới
              </button>
              <button
                onClick={() => fetchHeritages(currentPage)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Loader2 className="w-4 h-4" />}
                Tải Lại
              </button>
            </div>
          )}
        </div>

        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Content */}
        {activeTab === 'analytics' ? (
          <AnalyticsDashboard heritages={heritages} />
        ) : (
          <>
            {/* Search */}
            {!isCreating && !isEditing && !selectedHeritage && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, địa chỉ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* List View */}
            {!isCreating && !isEditing && !selectedHeritage && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tên Di Sản</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Địa Chỉ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Xếp Hạng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phân loại</th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Media</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Thao Tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredHeritages.map((heritage) => (
                            <tr key={heritage.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{heritage.id}</td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                <div className="flex items-center gap-2">
                                  {heritage.name}
                                  {heritage.audio_url && <span title="Có audio">🔊</span>}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                {heritage.address?.substring(0, 50)}...
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${heritage.ranking_type?.includes('đặc biệt') ? 'bg-red-100 text-red-800' :
                                  heritage.ranking_type?.includes('Quốc gia') ? 'bg-yellow-100 text-yellow-800' :
                                    heritage.ranking_type?.includes('tỉnh') ? 'bg-green-100 text-green-800' :
                                      'bg-gray-100 text-gray-800'
                                  }`}>
                                  {heritage.ranking_type || 'Chưa xếp hạng'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {heritageCategories.find(c => c.value === heritage.category)?.label || 'Di sản'}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-3">
                                  {heritage.media_count?.images > 0 && (
                                    <span className="flex items-center gap-1 text-blue-600">
                                      <ImageIcon className="w-4 h-4" />
                                      {heritage.media_count.images}
                                    </span>
                                  )}
                                  {heritage.media_count?.videos > 0 && (
                                    <span className="flex items-center gap-1 text-red-600">
                                      <Video className="w-4 h-4" />
                                      {heritage.media_count.videos}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => handleView(heritage)} className="text-blue-600 hover:text-blue-800" title="Xem">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleEdit(heritage)} className="text-green-600 hover:text-green-800" title="Sửa">
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDelete(heritage)} className="text-red-600 hover:text-red-800" title="Xóa">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Trang {currentPage} / {pagination.totalPages} (Tổng: {pagination.total})
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 border rounded-lg disabled:opacity-50"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                            disabled={currentPage === pagination.totalPages}
                            className="px-3 py-2 border rounded-lg disabled:opacity-50"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* View Detail */}
            {selectedHeritage && !isEditing && !isCreating && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedHeritage.name}</h2>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(selectedHeritage)} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                      <Edit2 className="w-4 h-4" /> Chỉnh Sửa
                    </button>
                    <button onClick={handleCancel} className="px-4 py-2 bg-gray-600 text-white rounded-lg">Đóng</button>
                  </div>
                </div>

                {selectedHeritage.image_url && (
                  <img src={selectedHeritage.image_url} alt={selectedHeritage.name} className="w-full max-w-md rounded-lg mb-4" />
                )}


                <div className="space-y-4">
                  <div><strong>Địa chỉ:</strong> {selectedHeritage.address}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><strong>Năm xây dựng:</strong> {selectedHeritage.year_built || 'N/A'}</div>
                    <div><strong>Năm xếp hạng:</strong> {selectedHeritage.year_ranked || 'N/A'}</div>
                  </div>
                  <div><strong>Loại xếp hạng:</strong> {selectedHeritage.ranking_type}</div>
                  <div>
                    <strong>Phân loại:</strong> {
                      heritageCategories.find(c => c.value === selectedHeritage.category)?.label || 'Di sản'
                    }
                  </div>
                  <div>
                    <strong>Thông tin:</strong>
                    <p className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">{selectedHeritage.information || 'Chưa có'}</p>
                  </div>
                  {selectedHeritage.audio_url && (
                    <div>
                      <strong>Audio:</strong>
                      <audio controls className="mt-2 w-full">
                        <source src={selectedHeritage.audio_url} type="audio/wav" />
                      </audio>
                    </div>
                  )}

                  {/* NEW: Gallery Display */}
                  {selectedHeritage.gallery && selectedHeritage.gallery.length > 0 && (
                    <div>
                      <strong className="block mb-2">Thư viện ảnh ({selectedHeritage.gallery.length}):</strong>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selectedHeritage.gallery.map((img) => (
                          <div key={img.id} className="relative group">
                            <img
                              src={img.url}
                              alt={`Gallery ${img.order}`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* NEW: YouTube Videos Display */}
                  {selectedHeritage.youtube_links && selectedHeritage.youtube_links.length > 0 && (
                    <div>
                      <strong className="block mb-2">Video YouTube ({selectedHeritage.youtube_links.length}):</strong>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedHeritage.youtube_links.map((video) => {
                          const videoId = getYouTubeVideoId(video.url);
                          return (
                            <div key={video.id} className="aspect-video">
                              {videoId ? (
                                <iframe
                                  src={`https://www.youtube.com/embed/${videoId}`}
                                  className="w-full h-full rounded-lg"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              ) : (
                                <a
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                  <LinkIcon className="w-6 h-6 mr-2" />
                                  Xem video
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Create/Edit Form */}
            {(isCreating || isEditing) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isCreating ? 'Thêm Di Sản Mới' : 'Chỉnh Sửa Di Sản'}
                  </h2>
                  <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Input Language */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Ngôn ngữ nhập liệu</label>
                    <select
                      value={formData.input_lang || 'vi'}
                      onChange={(e) => setFormData({ ...formData, input_lang: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                      {inputLanguages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Hệ thống sẽ tự động dịch sang 3 ngôn ngữ còn lại</p>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tên Di Sản *</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="Nhập tên di sản..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Địa Chỉ *</label>
                      <input
                        type="text"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="Địa chỉ đầy đủ..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Xã/Phường</label>
                      <input
                        type="text"
                        value={formData.commune || ''}
                        onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Quận/Huyện</label>
                      <input
                        type="text"
                        value={formData.district || ''}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tỉnh/Thành phố</label>
                      <input
                        type="text"
                        value={formData.province || ''}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Loại Xếp Hạng</label>
                      <select
                        value={formData.ranking_type || ''}
                        onChange={(e) => setFormData({ ...formData, ranking_type: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      >
                        {rankingTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phân loại
                      </label>
                      <select
                        value={formData.category || 'di_san'}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      >
                        {heritageCategories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Năm Xây Dựng</label>
                      <input
                        type="number"
                        value={formData.year_built || ''}
                        onChange={(e) => setFormData({ ...formData, year_built: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Năm Xếp Hạng</label>
                      <input
                        type="number"
                        value={formData.year_ranked || ''}
                        onChange={(e) => setFormData({ ...formData, year_ranked: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Information */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Thông tin chi tiết *</label>
                    <textarea
                      value={formData.information || ''}
                      onChange={(e) => setFormData({ ...formData, information: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder="Nhập thông tin chi tiết về di sản... (sẽ được dùng để tạo audio)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Nội dung này sẽ được dịch và tạo audio tự động cho 4 ngôn ngữ</p>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Ghi chú</label>
                    <input
                      type="text"
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder="Ghi chú thêm..."
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Hình ảnh chính</label>
                    <div className="flex items-center gap-4">
                      <label className="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Chọn ảnh
                        <input
                          type="file"
                          accept="image/*"
                          onClick={(e) => { e.target.value = ''; }}
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
                      )}
                    </div>
                  </div>

                  {/* Image 360 Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Hình ảnh 360°
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="px-4 py-2 bg-teal-600 text-white rounded-lg cursor-pointer hover:bg-teal-700 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Chọn ảnh 360
                        <input
                          type="file"
                          accept="image/*"
                          onClick={(e) => { e.target.value = ''; }}
                          onChange={handleImage360Change}
                          className="hidden"
                        />
                      </label>

                      {image360Preview && (
                        <img
                          src={image360Preview}
                          alt="360 Preview"
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload ảnh equirectangular panorama (.jpg)
                    </p>
                  </div>

                  {/* Coordinates */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tọa độ (Lng, Lat)
                    </label>
                    <input
                      type="text"
                      value={formData.coordinates || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, coordinates: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder="[105.23, 9.12]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Nhập dạng: [kinh độ, vĩ độ] ví dụ: [105.23, 9.12]
                    </p>
                  </div>


                  {/* Audio Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Audio thuyết minh</label>
                    <div className="flex items-center gap-4">
                      <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Chọn audio
                        <input
                          type="file"
                          accept="audio/*"
                          onClick={(e) => { e.target.value = ''; }}
                          onChange={handleAudioChange}
                          className="hidden"
                        />
                      </label>

                      {audioPreview && (
                        <audio
                          key={audioPreview}   // 👈 cực quan trọng
                          controls
                          src={audioPreview}
                          className="h-10"
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Có thể upload file .mp3, .wav, .m4a...
                    </p>
                  </div>

                  {/* NEW: Gallery Images Section */}
                  <div className="border-t pt-6">
                    <label className="block text-sm font-medium mb-4">
                      <ImageIcon className="w-5 h-5 inline mr-2" />
                      Thư viện ảnh
                    </label>

                    {/* Existing Gallery (Edit mode) */}
                    {isEditing && existingGallery.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Ảnh hiện có (chọn để giữ lại):</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {existingGallery.map((img) => (
                            <div key={img.id} className="relative group">
                              <img
                                src={img.url}
                                alt={`Gallery ${img.order}`}
                                className={`w-full h-32 object-cover rounded-lg cursor-pointer border-4 transition-all ${keepMediaIds.includes(img.id)
                                  ? 'border-green-500'
                                  : 'border-gray-300 opacity-50'
                                  }`}
                                onClick={() => toggleExistingGallery(img.id)}
                              />
                              <div
                                className="absolute top-2 right-2 bg-white rounded-full p-1 cursor-pointer"
                                onClick={() => toggleExistingGallery(img.id)}
                              >
                                {keepMediaIds.includes(img.id) ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <X className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Ảnh có viền xanh sẽ được giữ lại. Click để chọn/bỏ chọn.
                        </p>
                      </div>
                    )}

                    {/* New Gallery Uploads */}
                    <div className="flex items-center gap-4 mb-4">
                      <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Thêm ảnh mới
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onClick={(e) => { e.target.value = ''; }}
                          onChange={handleGalleryChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-sm text-gray-500">
                        {galleryFiles.length} ảnh mới được chọn
                      </span>
                    </div>

                    {/* Gallery Previews */}
                    {galleryPreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {galleryPreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`New ${index}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeGalleryPreview(index)}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* NEW: YouTube Links Section */}
                  <div className="border-t pt-6">
                    <label className="block text-sm font-medium mb-4">
                      <Video className="w-5 h-5 inline mr-2" />
                      Video YouTube
                    </label>

                    {youtubeLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-2 mb-3">
                        <input
                          type="url"
                          value={link}
                          onChange={(e) => updateYoutubeLink(index, e.target.value)}
                          className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                        {youtubeLinks.length > 1 && (
                          <button
                            onClick={() => removeYoutubeLink(index)}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      onClick={addYoutubeLink}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm video
                    </button>

                    <p className="text-xs text-gray-500 mt-2">
                      Hỗ trợ các định dạng: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
                    </p>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isCreating ? 'Thêm Mới' : 'Lưu Thay Đổi'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}