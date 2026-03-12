import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  Award,
  BarChart3,
  CheckCircle,
  Clock,
  Database,
  Image as ImageIcon,
  MapPin,
  Music,
  TrendingUp,
  Video,
} from 'lucide-react';

const getRankingColorClass = (name = '') => {
  const value = name.toLowerCase();
  if (
    value.includes('đặc biệt') ||
    value.includes('special')
  ) {
    return 'bg-red-500';
  }
  if (
    value.includes('quốc gia') ||
    value.includes('national') ||
    value.includes('國家')
  ) {
    return 'bg-yellow-500';
  }
  if (
    value.includes('tỉnh') ||
    value.includes('provincial') ||
    value.includes('省')
  ) {
    return 'bg-green-500';
  }
  return 'bg-gray-400';
};

const toPercent = (value, total, digits = 1) => {
  if (!total) return Number(0).toFixed(digits);
  return ((value / total) * 100).toFixed(digits);
};

export default function AnalyticsDashboard({ heritages = [] }) {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('all');

  const stats = useMemo(() => {
    const total = heritages.length;
    const notRankedLabel = t('admin.notRanked');
    const unknownCommuneLabel = t('admin.unknownCommune');

    const byRanking = {};
    const byYear = {};
    const byCommune = {};

    heritages.forEach((heritage) => {
      const rankingType = heritage.rankingType || notRankedLabel;
      byRanking[rankingType] = (byRanking[rankingType] || 0) + 1;

      if (heritage.yearBuilt) {
        const year = heritage.yearBuilt;
        byYear[year] = (byYear[year] || 0) + 1;
      }

      const commune = heritage.commune || unknownCommuneLabel;
      byCommune[commune] = (byCommune[commune] || 0) + 1;
    });

    const withAudio = heritages.filter((heritage) => heritage.audioFile && heritage.audioFile.trim()).length;
    const withVideo = heritages.filter((heritage) => heritage.youtubeUrl && heritage.youtubeUrl.trim()).length;
    const withImage = heritages.filter((heritage) => heritage.image && heritage.image.trim()).length;
    const withFullInfo = heritages.filter((heritage) => heritage.information && heritage.information.length > 100).length;

    const totalChars = heritages.reduce((sum, heritage) => sum + (heritage.information?.length || 0), 0);
    const avgChars = total > 0 ? Math.round(totalChars / total) : 0;
    const recent = [...heritages].sort((a, b) => b.id - a.id).slice(0, 5);

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
  }, [heritages, t]);

  const topCommunes = useMemo(() => {
    return Object.entries(stats.byCommune)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [stats.byCommune]);

  const rankingData = useMemo(() => {
    return Object.entries(stats.byRanking).map(([name, value]) => ({
      name,
      value,
      percentage: toPercent(value, stats.total, 1),
    }));
  }, [stats.byRanking, stats.total]);

  const overallScore = toPercent(
    stats.withFullInfo + stats.withAudio + stats.withVideo + stats.withImage,
    stats.total * 4,
    1
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            {t('admin.analyticsTitle')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('admin.analyticsSubtitle')}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {t('admin.timeRangeAll')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{stats.total}</span>
          </div>
          <div className="text-sm opacity-90">{t('admin.analyticsTotalHeritages')}</div>
          <div className="text-xs opacity-75 mt-1">{t('admin.analyticsDataCoverage')}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Music className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{stats.withAudio}</span>
          </div>
          <div className="text-sm opacity-90">{t('admin.analyticsWithAudio')}</div>
          <div className="text-xs opacity-75 mt-1">
            {toPercent(stats.withAudio, stats.total, 1)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Video className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{stats.withVideo}</span>
          </div>
          <div className="text-sm opacity-90">{t('admin.analyticsWithVideo')}</div>
          <div className="text-xs opacity-75 mt-1">
            {toPercent(stats.withVideo, stats.total, 1)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{stats.withFullInfo}</span>
          </div>
          <div className="text-sm opacity-90">{t('admin.analyticsWithFullInfo')}</div>
          <div className="text-xs opacity-75 mt-1">
            {toPercent(stats.withFullInfo, stats.total, 1)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            {t('admin.analyticsRankingDistribution')}
          </h3>
          <div className="space-y-3">
            {rankingData.map((item, idx) => (
              <div key={`${item.name}-${idx}`}>
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
                    className={`h-2 rounded-full ${getRankingColorClass(item.name)}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            {t('admin.top10Communes')}
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {topCommunes.map(([commune, count], idx) => (
              <div
                key={`${commune}-${idx}`}
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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          {t('admin.analyticsContentStats')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalChars.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('admin.analyticsTotalCharacters')}
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.avgChars.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('admin.analyticsAveragePerHeritage')}
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.withImage}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('admin.analyticsWithImages')}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-600" />
          {t('admin.analyticsRecentItems')}
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
                  <Music className="w-4 h-4 text-purple-500" title={t('admin.analyticsAudio')} />
                )}
                {heritage.youtubeUrl && (
                  <Video className="w-4 h-4 text-red-500" title={t('admin.analyticsVideo')} />
                )}
                {heritage.image && (
                  <ImageIcon className="w-4 h-4 text-green-500" title={t('admin.analyticsImage')} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {t('admin.analyticsDataQualityIndex')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold">
              {toPercent(stats.withFullInfo, stats.total, 0)}%
            </div>
            <div className="text-sm opacity-90 mt-1">{t('admin.analyticsFullInfo')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {toPercent(stats.withAudio, stats.total, 0)}%
            </div>
            <div className="text-sm opacity-90 mt-1">{t('admin.analyticsAudio')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {toPercent(stats.withVideo, stats.total, 0)}%
            </div>
            <div className="text-sm opacity-90 mt-1">{t('admin.analyticsVideo')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {toPercent(stats.withImage, stats.total, 0)}%
            </div>
            <div className="text-sm opacity-90 mt-1">{t('admin.analyticsImage')}</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-90">{t('admin.analyticsOverallScore')}</span>
            <span className="text-4xl font-bold">
              {overallScore}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 mt-2">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallScore}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
