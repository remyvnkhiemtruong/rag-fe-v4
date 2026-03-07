import { useTranslation } from 'react-i18next';
import MusicManagement from './MusicManagement';

export default function MusicManager({ onBack }) {
  const { t } = useTranslation();
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
              <h1 className="text-2xl font-display font-bold">{t('admin.musicManagement')}</h1>
              <p className="text-heritage-gold-300 dark:text-gray-400 text-sm">{t('admin.descMusic')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MusicManagement />
      </div>
    </div>
  );
}
