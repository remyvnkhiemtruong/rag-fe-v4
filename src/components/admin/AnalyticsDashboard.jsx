import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Award,
  MapPin,
  PieChart,
  Activity,
  Database,
  Clock,
  CheckCircle,
  AlertCircle,
  Music,
  Video,
  Image as ImageIcon,
} from 'lucide-react';

export default function AnalyticsDashboard({ heritages = [] }) {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('all'); // 'all', 'year', 'month'

  // Calculate statistics
  const stats = useMemo(() => {
    const total = heritages.length;

    // By ranking type
    const byRanking = {};
    heritages.forEach(h => {
      const type = h.rankingType || 'Chưa xếp hạng';
      byRanking[type] = (byRanking[type] || 0) + 1;
    });

    // By year
    const byYear = {};
    heritages.forEach(h => {
      if (h.yearBuilt) {
        const year = h.yearBuilt;
        byYear[year] = (byYear[year] || 0) + 1;
      }
    });

    // By commune
    const byCommune = {};
    heritages.forEach(h => {
      const commune = h.commune || 'Chưa rõ';
      byCommune[commune] = (byCommune[commune] || 0) + 1;
    });

    // Media statistics
    const withAudio = heritages.filter(h => h.audioFile && h.audioFile.trim()).length;
    const withVideo = heritages.filter(h => h.youtubeUrl && h.youtubeUrl.trim()).length;
    const withImage = heritages.filter(h => h.image && h.image.trim()).length;
    const withFullInfo = heritages.filter(h =>
      h.information && h.information.length > 100
    ).length;

    // Content statistics
    const totalChars = heritages.reduce((sum, h) => sum + (h.information?.length || 0), 0);
    const avgChars = total > 0 ? Math.round(totalChars / total) : 0;

    // Recent additions (if we had timestamps, but we'll use ID as proxy)
    const sortedByTime = [...heritages].sort((a, b) => b.id - a.id);
    const recent = sortedByTime.slice(0, 5);

    return {
      total,
      byRanking,
      byYear,
      byCommune,
      withAudio,
      withVideo,
      withImage,
      withFullInfo,
      totalChars,
      avgChars,
      recent,
    };
  }, [heritages]);

  // Top communes
  const topCommunes = useMemo(() => {
    return Object.entries(stats.byCommune)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [stats.byCommune]);

  // Ranking distribution
  const rankingData = useMemo(() => {
    return Object.entries(stats.byRanking).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / stats.total) * 100).toFixed(1),
    }));
  }, [stats.byRanking, stats.total]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            Phân Tích Dữ Liệu
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Thống kê và phân tích chi tiết về di sản văn hóa
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Tất cả
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Heritages */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{stats.total}</span>
          </div>
          <div className="text-sm opacity-90">Tổng Di Sản</div>
          <div className="text-xs opacity-75 mt-1">100% dữ liệu</div>
        </div>

        {/* With Audio */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Music className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{stats.withAudio}</span>
          </div>
          <div className="text-sm opacity-90">Có Audio</div>
          <div className="text-xs opacity-75 mt-1">
            {((stats.withAudio / stats.total) * 100).toFixed(1)}%
          </div>
        </div>

        {/* With Video */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Video className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{stats.withVideo}</span>
          </div>
          <div className="text-sm opacity-90">Có Video</div>
          <div className="text-xs opacity-75 mt-1">
            {((stats.withVideo / stats.total) * 100).toFixed(1)}%
          </div>
        </div>

        {/* With Full Info */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{stats.withFullInfo}</span>
          </div>
          <div className="text-sm opacity-90">Thông Tin Đầy Đủ</div>
          <div className="text-xs opacity-75 mt-1">
            {((stats.withFullInfo / stats.total) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Phân Bố Theo Xếp Hạng
          </h3>
          <div className="space-y-3">
            {rankingData.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.value} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.name.includes('đặc biệt')
                        ? 'bg-red-500'
                        : item.name.includes('Quốc gia')
                        ? 'bg-yellow-500'
                        : item.name.includes('tỉnh')
                        ? 'bg-green-500'
                        : 'bg-gray-400'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Communes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            {t('admin.top10Communes')}
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {topCommunes.map(([commune, count], idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400 w-6">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {commune}
                  </span>
                </div>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Thống Kê Nội Dung
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalChars.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Tổng Ký Tự
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.avgChars.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Trung Bình/Di Sản
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.withImage}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Có Hình Ảnh
            </div>
          </div>
        </div>
      </div>

      {/* Recent Additions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-600" />
          Mục Gần Đây (Top 5)
        </h3>
        <div className="space-y-3">
          {stats.recent.map((heritage, idx) => (
            <div
              key={heritage.id}
              className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-2xl font-bold text-gray-300 dark:text-gray-600">
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  {heritage.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {heritage.address}
                </div>
              </div>
              <div className="flex gap-2">
                {heritage.audioFile && (
                  <Music className="w-4 h-4 text-purple-500" title="Có audio" />
                )}
                {heritage.youtubeUrl && (
                  <Video className="w-4 h-4 text-red-500" title="Có video" />
                )}
                {heritage.image && (
                  <ImageIcon className="w-4 h-4 text-green-500" title="Có ảnh" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Quality Score */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Chỉ Số Chất Lượng Dữ Liệu
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold">
              {((stats.withFullInfo / stats.total) * 100).toFixed(0)}%
            </div>
            <div className="text-sm opacity-90 mt-1">Thông tin đầy đủ</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {((stats.withAudio / stats.total) * 100).toFixed(0)}%
            </div>
            <div className="text-sm opacity-90 mt-1">Có audio</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {((stats.withVideo / stats.total) * 100).toFixed(0)}%
            </div>
            <div className="text-sm opacity-90 mt-1">Có video</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {((stats.withImage / stats.total) * 100).toFixed(0)}%
            </div>
            <div className="text-sm opacity-90 mt-1">Có hình ảnh</div>
          </div>
        </div>

        {/* Overall score */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-90">Điểm Tổng Thể</span>
            <span className="text-4xl font-bold">
              {(
                ((stats.withFullInfo + stats.withAudio + stats.withVideo + stats.withImage) /
                (stats.total * 4)) * 100
              ).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 mt-2">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{
                width: `${
                  ((stats.withFullInfo + stats.withAudio + stats.withVideo + stats.withImage) /
                  (stats.total * 4)) * 100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
