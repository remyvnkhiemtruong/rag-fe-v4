import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  ChevronLeft,
  Globe,
  Volume2,
  Database,
  Shield,
  Bell,
  Moon,
  Sun,
  Type,
  Minus,
  Plus,
  Smartphone,
  Download,
  Trash2,
  HardDrive,
  RefreshCw,
  Check,
  AlertCircle,
  Wifi,
  WifiOff,
  Eye,
  Lock
} from 'lucide-react';
import { useTheme, fontSizes } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { usePWA } from '../../hooks/usePWA';

export default function SettingsPage({ onBack }) {
  const { t } = useTranslation();
  const {
    isDarkMode,
    setDarkMode,
    fontSize,
    changeFontSize,
    getCurrentFontSize,
    resetToDefaults
  } = useTheme();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const {
    isOnline,
    isInstallable,
    isInstalled,
    isPWASupported,
    installApp,
    clearCache,
    getStorageEstimate
  } = usePWA();

  const [storageInfo, setStorageInfo] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearCacheConfirm, setShowClearCacheConfirm] = useState(false);
  const [notifications, setNotifications] = useState({
    newHeritage: true,
    updates: true,
    reminders: false
  });

  // Load storage info
  useEffect(() => {
    const loadStorageInfo = async () => {
      const info = await getStorageEstimate();
      setStorageInfo(info);
    };
    loadStorageInfo();
  }, [getStorageEstimate]);

  const handleClearCache = async () => {
    await clearCache();
    const info = await getStorageEstimate();
    setStorageInfo(info);
    setShowClearCacheConfirm(false);
  };

  const handleResetSettings = () => {
    resetToDefaults();
    changeLanguage('vi');
    setNotifications({
      newHeritage: true,
      updates: true,
      reminders: false
    });
    setShowResetConfirm(false);
  };

  const handleInstall = async () => {
    await installApp();
  };

  const currentFontInfo = getCurrentFontSize();

  return (
    <div className="min-h-screen bg-heritage-cream-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 theme-transition">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-heritage-cream-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-heritage-earth-700 dark:text-gray-300" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-heritage-earth-100 dark:bg-gray-700 flex items-center justify-center">
            <Settings className="w-6 h-6 text-heritage-earth-600 dark:text-gray-300" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-heritage-earth-900 dark:text-gray-100">
              {t('admin.settings')}
            </h1>
            <p className="text-sm text-heritage-earth-600 dark:text-gray-400">
              {t('settings.subtitle')}
            </p>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-heritage-earth-100 dark:border-gray-700 bg-gradient-to-r from-amber-50/80 to-heritage-cream-100 dark:from-gray-800 dark:to-gray-700/90">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="font-display font-bold text-heritage-earth-900 dark:text-gray-100">
                {t('settings.appearance')}
              </h2>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Dark Mode */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                )}
                <div>
                  <h3 className="font-medium text-heritage-earth-900 dark:text-gray-100">
                    {t('settings.appearance')}
                  </h3>
                  <p className="text-sm text-heritage-earth-500 dark:text-gray-400">
                    {isDarkMode ? t('settings.usingDark') : t('settings.usingLight')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setDarkMode(false)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    !isDarkMode
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-2 border-amber-400 dark:border-amber-600'
                      : 'bg-heritage-cream-50 dark:bg-gray-700 text-heritage-earth-600 dark:text-gray-300 border border-heritage-earth-200 dark:border-gray-600 hover:bg-heritage-cream-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  {t('settings.lightMode')}
                </button>
                <button
                  onClick={() => setDarkMode(true)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isDarkMode
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-2 border-amber-400 dark:border-amber-600'
                      : 'bg-heritage-cream-50 dark:bg-gray-700 text-heritage-earth-600 dark:text-gray-300 border border-heritage-earth-200 dark:border-gray-600 hover:bg-heritage-cream-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  {t('settings.darkMode')}
                </button>
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Type className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <h3 className="font-medium text-heritage-earth-900 dark:text-gray-100">
                    {t('settings.fontSize')}
                  </h3>
                  <p className="text-sm text-heritage-earth-500 dark:text-gray-400">
                    {currentFontInfo.label}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-8">
                {fontSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => changeFontSize(size.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      fontSize === size.id
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-2 border-amber-400 dark:border-amber-600'
                        : 'bg-heritage-cream-50 dark:bg-gray-700 text-heritage-earth-600 dark:text-gray-300 border border-heritage-earth-200 dark:border-gray-600 hover:bg-heritage-cream-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span style={{ fontSize: `${size.scale * 12}px` }}>Aa</span>
                    <span className="ml-2">{size.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-heritage-earth-100 dark:border-gray-700 bg-gradient-to-r from-amber-50/80 to-heritage-cream-100 dark:from-gray-800 dark:to-gray-700/90">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="font-display font-bold text-heritage-earth-900 dark:text-gray-100">
                {t('settings.language')}
              </h2>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    currentLanguage === lang.code
                      ? 'bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-400 dark:border-amber-600'
                      : 'bg-heritage-cream-50 dark:bg-gray-700 border border-heritage-earth-200 dark:border-gray-600 hover:bg-heritage-cream-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="text-left">
                    <div className={`font-medium text-sm ${
                      currentLanguage === lang.code
                        ? 'text-amber-800 dark:text-amber-200'
                        : 'text-heritage-earth-700 dark:text-gray-300'
                    }`}>
                      {lang.name}
                    </div>
                  </div>
                  {currentLanguage === lang.code && (
                    <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PWA & Offline Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-heritage-earth-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <h2 className="font-display font-bold text-heritage-earth-900 dark:text-gray-100">
                {t('settings.appAndOffline')}
              </h2>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Online Status */}
            <div className="flex items-center justify-between p-3 bg-heritage-cream-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                {isOnline ? (
                  <Wifi className="w-5 h-5 text-emerald-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-amber-500" />
                )}
                <div>
                  <h3 className="font-medium text-heritage-earth-900 dark:text-gray-100">
                    {t('settings.connectionStatus')}
                  </h3>
                  <p className={`text-sm ${isOnline ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {isOnline ? t('common.online') : t('common.offline')}
                  </p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
            </div>

            {/* Install App */}
            {isPWASupported && (
              <div className="flex items-center justify-between p-3 bg-heritage-cream-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-purple-600" />
                  <div>
                    <h3 className="font-medium text-heritage-earth-900 dark:text-gray-100">
                      {t('settings.installAppTitle')}
                    </h3>
                    <p className="text-sm text-heritage-earth-500 dark:text-gray-400">
                      {isInstalled ? t('common.installed') : t('common.addToHomeScreen')}
                    </p>
                  </div>
                </div>
                {isInstalled ? (
                  <span className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                    <Check className="w-4 h-4" />
                    {t('settings.installedShort')}
                  </span>
                ) : isInstallable ? (
                  <button
                    onClick={handleInstall}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {t('pwa.install')}
                  </button>
                ) : (
                  <span className="text-sm text-heritage-earth-400 dark:text-gray-500">
                    {t('settings.notAvailable')}
                  </span>
                )}
              </div>
            )}

            {/* Storage Info */}
            {storageInfo && (
              <div className="p-3 bg-heritage-cream-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <HardDrive className="w-5 h-5 text-heritage-gold-600" />
                  <div>
                    <h3 className="font-medium text-heritage-earth-900 dark:text-gray-100">
                      {t('settings.storage')}
                    </h3>
                    <p className="text-sm text-heritage-earth-500 dark:text-gray-400">
                      {t('settings.storageUsed', { used: storageInfo.usageInMB, quota: storageInfo.quotaInMB })}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-heritage-gold-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(storageInfo.percentUsed, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Clear Cache */}
            <div className="flex items-center justify-between p-3 bg-heritage-cream-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="font-medium text-heritage-earth-900 dark:text-gray-100">
                    {t('settings.clearCache')}
                  </h3>
                  <p className="text-sm text-heritage-earth-500 dark:text-gray-400">
                    {t('settings.clearCacheDesc')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowClearCacheConfirm(true)}
                className="px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-heritage-earth-100 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-amber-600" />
              <h2 className="font-display font-bold text-heritage-earth-900 dark:text-gray-100">
                {t('settings.notifications')}
              </h2>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {[
              { key: 'newHeritage', labelKey: 'settings.newHeritage', descKey: 'settings.newHeritageNotif' },
              { key: 'updates', labelKey: 'settings.updates', descKey: 'settings.updatesDesc' },
              { key: 'reminders', labelKey: 'settings.reminders', descKey: 'settings.remindersDesc' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-heritage-earth-900 dark:text-gray-100">
                    {t(item.labelKey)}
                  </h3>
                  <p className="text-sm text-heritage-earth-500 dark:text-gray-400">
                    {t(item.descKey)}
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    notifications[item.key] ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                      notifications[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-heritage-earth-100 dark:border-gray-700">
            <h3 className="font-display font-bold text-heritage-earth-900 dark:text-gray-100">
              {t('settings.systemInfo')}
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-heritage-cream-50 dark:bg-gray-700 rounded-xl">
                <div className="text-heritage-earth-500 dark:text-gray-400 mb-1">{t('settings.version')}</div>
                <div className="font-medium text-heritage-earth-900 dark:text-gray-100">1.0.0</div>
              </div>
              <div className="p-3 bg-heritage-cream-50 dark:bg-gray-700 rounded-xl">
                <div className="text-heritage-earth-500 dark:text-gray-400 mb-1">Framework</div>
                <div className="font-medium text-heritage-earth-900 dark:text-gray-100">React + Vite</div>
              </div>
              <div className="p-3 bg-heritage-cream-50 dark:bg-gray-700 rounded-xl">
                <div className="text-heritage-earth-500 dark:text-gray-400 mb-1">{t('settings.languageSupport')}</div>
                <div className="font-medium text-heritage-earth-900 dark:text-gray-100">{t('settings.fourLanguages')}</div>
              </div>
              <div className="p-3 bg-heritage-cream-50 dark:bg-gray-700 rounded-xl">
                <div className="text-heritage-earth-500 dark:text-gray-400 mb-1">AI Backend</div>
                <div className="font-medium text-heritage-earth-900 dark:text-gray-100">RAG + LLM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reset Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-red-200 dark:border-red-900/50 overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-red-500" />
              <div>
                <h3 className="font-medium text-heritage-earth-900 dark:text-gray-100">
                  {t('settings.resetSettings')}
                </h3>
                <p className="text-sm text-heritage-earth-500 dark:text-gray-400">
                  {t('settings.resetDesc')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('settings.reset')}
            </button>
          </div>
        </div>

        {/* Confirmation Modals */}
        {showClearCacheConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-heritage-earth-900 dark:text-gray-100">
                    {t('settings.clearCacheConfirmTitle')}
                  </h3>
                  <p className="text-sm text-heritage-earth-500 dark:text-gray-400">
                    {t('settings.cannotUndo')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-heritage-earth-600 dark:text-gray-300 mb-6">
                {t('settings.clearCacheConfirmDesc')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearCacheConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-heritage-earth-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleClearCache}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                >
                  {t('common.delete')}
                </button>
              </div>
            </div>
          </div>
        )}

        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-heritage-earth-900 dark:text-gray-100">
                    {t('settings.resetConfirmTitle')}
                  </h3>
                  <p className="text-sm text-heritage-earth-500 dark:text-gray-400">
                    {t('settings.resetToDefault')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-heritage-earth-600 dark:text-gray-300 mb-6">
                {t('settings.resetConfirmDesc')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-heritage-earth-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleResetSettings}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                >
                  {t('settings.reset')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
