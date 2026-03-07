import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Volume2,
  Plus,
  Search,
  ChevronLeft,
  Play,
  Pause,
  Trash2,
  Upload,
  Globe,
  FileAudio,
  AlertCircle
} from 'lucide-react';

const languages = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'km', name: 'ភាសាខ្មែរ', flag: '🇰🇭' },
];

export default function AudioManager({ onBack }) {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('vi');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState(null);

  // Placeholder audio data - in production, this would come from API/storage
  const [audioFiles] = useState([
    { id: 1, name: 'Căn cứ Cái Chanh', heritageId: 1, languages: ['vi'], duration: '3:45' },
    { id: 2, name: 'Chùa Phật Tổ', heritageId: 2, languages: ['vi', 'en'], duration: '2:30' },
    { id: 3, name: 'Đình Tân Hưng', heritageId: 3, languages: ['vi'], duration: '4:12' },
  ]);

  const handlePlay = (id) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  const filteredAudio = audioFiles.filter(audio =>
    audio.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-heritage-cream-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 theme-transition">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-heritage-cream-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-heritage-earth-900 dark:text-gray-100">
                {t('admin.audioManagement')}
              </h2>
              <p className="text-sm text-heritage-earth-600 dark:text-gray-400">
                {t('admin.audioSubtitle')}
              </p>
            </div>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-xl hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors shadow-lg"
          >
            <Upload className="w-5 h-5" />
            {t('admin.uploadAudio')}
          </button>
        </div>

        {/* Language Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 p-4 theme-transition">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-5 h-5 text-heritage-gold-600 dark:text-heritage-gold-400" />
            <span className="font-medium text-heritage-earth-700 dark:text-gray-300">{t('admin.filterByLanguage')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedLanguage('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedLanguage === 'all'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-2 border-purple-300 dark:border-purple-600'
                  : 'bg-heritage-cream-50 dark:bg-gray-700 text-heritage-earth-600 dark:text-gray-300 border border-heritage-earth-200 dark:border-gray-600 hover:bg-heritage-cream-100 dark:hover:bg-gray-600'
              }`}
            >
              Tất cả
            </button>
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedLanguage === lang.code
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-2 border-purple-300 dark:border-purple-600'
                    : 'bg-heritage-cream-50 dark:bg-gray-700 text-heritage-earth-600 dark:text-gray-300 border border-heritage-earth-200 dark:border-gray-600 hover:bg-heritage-cream-100 dark:hover:bg-gray-600'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-heritage-earth-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.searchAudio')}
            className="w-full pl-12 pr-4 py-3 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* TTS API Info */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200 dark:border-purple-700 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <FileAudio className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-heritage-earth-900 dark:text-gray-100 mb-2">
                Text-to-Speech API
              </h3>
              <p className="text-sm text-heritage-earth-600 dark:text-gray-400 mb-3">
                Hệ thống hỗ trợ tự động tạo audio từ văn bản sử dụng các dịch vụ TTS như Google Cloud Text-to-Speech hoặc Azure Cognitive Services.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Google TTS
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Azure TTS
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-heritage-earth-600 dark:text-gray-400 border border-heritage-earth-200 dark:border-gray-600">
                  4 ngôn ngữ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Audio List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 overflow-hidden theme-transition">
          <div className="p-4 border-b border-heritage-earth-100 dark:border-gray-700">
            <h3 className="font-display font-bold text-heritage-earth-900 dark:text-gray-100">
              Audio đã tạo ({filteredAudio.length})
            </h3>
          </div>

          {filteredAudio.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-heritage-earth-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-heritage-earth-500 dark:text-gray-400">{t('admin.noAudio')}</p>
            </div>
          ) : (
            <div className="divide-y divide-heritage-earth-100 dark:divide-gray-700">
              {filteredAudio.map(audio => (
                <div
                  key={audio.id}
                  className="p-4 hover:bg-heritage-cream-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Play button */}
                    <button
                      onClick={() => handlePlay(audio.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        playingId === audio.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800/50'
                      }`}
                    >
                      {playingId === audio.id ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </button>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-heritage-earth-900 dark:text-gray-100 truncate">
                        {audio.name}
                      </h4>
                      <p className="text-sm text-heritage-earth-500 dark:text-gray-400">
                        Thời lượng: {audio.duration}
                      </p>
                    </div>

                    {/* Languages */}
                    <div className="hidden sm:flex items-center gap-1">
                      {audio.languages.map(lang => {
                        const langInfo = languages.find(l => l.code === lang);
                        return (
                          <span
                            key={lang}
                            className="text-lg"
                            title={langInfo?.name}
                          >
                            {langInfo?.flag}
                          </span>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <button
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600 dark:text-red-400"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generate Audio Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 p-6 theme-transition">
          <h3 className="font-display font-bold text-heritage-earth-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Tạo Audio mới từ Text-to-Speech
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                Chọn di sản
              </label>
              <select className="w-full px-4 py-2.5 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option value="">-- Chọn di sản --</option>
                <option value="1">Căn cứ Cái Chanh</option>
                <option value="2">Chùa Phật Tổ</option>
                <option value="3">Đình Tân Hưng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                Chọn ngôn ngữ
              </label>
              <div className="flex flex-wrap gap-2">
                {languages.map(lang => (
                  <label key={lang.code} className="flex items-center gap-2 px-3 py-2 bg-heritage-cream-50 dark:bg-gray-700 rounded-lg border border-heritage-earth-200 dark:border-gray-600 cursor-pointer hover:bg-heritage-cream-100 dark:hover:bg-gray-600 transition-colors">
                    <input type="checkbox" className="rounded border-heritage-earth-300 dark:border-gray-500 text-purple-600 focus:ring-purple-500 bg-white dark:bg-gray-600" />
                    <span>{lang.flag}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{lang.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg">
              Tạo Audio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
