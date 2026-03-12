import { X, MessageSquare, BookOpen, Brain, Volume2, Landmark, Sparkles, Settings, PenLine, Home, Map, Clock, Heart, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

export function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation();

  const menuItems = [
    {
      id: 'home',
      label: t('sidebar.home'),
      path: '/',
      icon: Home,
      description: t('sidebar.homeDesc')
    },
    {
      id: 'heritage',
      label: t('sidebar.exploreHeritage'),
      path: '/heritage',
      icon: BookOpen,
      description: t('sidebar.exploreDesc')
    },
    {
      id: 'map',
      label: t('sidebar.map'),
      path: '/map',
      icon: Map,
      description: t('sidebar.mapDesc')
    },
    {
      id: 'timeline',
      label: t('sidebar.timeline'),
      path: '/timeline',
      icon: Clock,
      description: t('sidebar.timelineDesc')
    },
    {
      id: 'chat',
      label: t('sidebar.aiChat'),
      path: '/chat',
      icon: MessageSquare,
      description: t('sidebar.aiChatDesc')
    },
    {
      id: 'quiz',
      label: t('sidebar.quizGame'),
      path: '/quiz',
      icon: Brain,
      description: t('sidebar.quizDesc')
    },
    {
      id: 'tts',
      label: t('sidebar.textToSpeech'),
      path: '/tts',
      icon: Volume2,
      description: t('sidebar.ttsDesc')
    },
    {
      id: 'contribute',
      label: t('sidebar.contribute'),
      path: '/contribute',
      icon: PenLine,
      description: t('sidebar.contributeDesc')
    },
    {
      id: 'favorites',
      label: t('sidebar.favorites'),
      path: '/favorites',
      icon: Heart,
      description: t('sidebar.favoritesDesc')
    },
    {
      id: 'about',
      label: t('sidebar.about'),
      path: '/about',
      icon: Info,
      description: t('sidebar.aboutDesc')
    }
  ];

  const systemItems = [
    {
      id: 'admin',
      label: t('sidebar.admin'),
      path: '/admin',
      icon: Settings,
      description: t('sidebar.adminDesc')
    }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-white dark:bg-gray-900 shadow-xl lg:shadow-md
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          border-r border-gray-200 dark:border-gray-700
          flex flex-col theme-transition
        `}
      >
        {/* Decorative top border */}
        <div className="h-1 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700" />

        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-heritage-red-700 flex items-center justify-center shadow-sm">
                <Landmark className="w-5 h-5 text-heritage-gold-300" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {t('sidebar.menu')}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('sidebar.navigation')}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
              aria-label={t('common.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-heritage">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  font-medium transition-all duration-200 group text-left
                  ${isActive
                    ? 'bg-heritage-red-700 text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`
                        w-9 h-9 rounded-lg flex items-center justify-center
                        transition-all duration-200 flex-shrink-0
                        ${isActive
                          ? 'bg-heritage-red-600 text-heritage-gold-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 group-hover:text-heritage-red-700 dark:group-hover:text-heritage-red-400'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold truncate">{item.label}</span>
                      <span
                        className={`block text-xs truncate ${isActive ? 'text-heritage-gold-200' : 'text-gray-500 dark:text-gray-400'}`}
                      >
                        {item.description}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-1 h-8 bg-heritage-gold-400 rounded-full flex-shrink-0" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Separator */}
          <div className="my-3 flex items-center gap-2 px-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
              {t('common.system')}
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* System items */}
          {systemItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  font-medium transition-all duration-200 group text-left
                  ${isActive
                    ? 'bg-gray-800 dark:bg-gray-700 text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`
                        w-9 h-9 rounded-lg flex items-center justify-center
                        transition-all duration-200 flex-shrink-0
                        ${isActive
                          ? 'bg-gray-700 dark:bg-gray-600 text-gray-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold truncate">{item.label}</span>
                      <span
                        className={`block text-xs truncate ${isActive ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}
                      >
                        {item.description}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-1 h-8 bg-gray-500 rounded-full flex-shrink-0" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer decoration */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
            <Sparkles className="w-4 h-4 text-heritage-gold-500" />
            <span className="text-xs font-medium">{t('common.appName')}</span>
            <Sparkles className="w-4 h-4 text-heritage-gold-500" />
          </div>

          {/* Ornamental divider */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-heritage-gold-400 to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-heritage-gold-400" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-heritage-gold-400 to-transparent" />
          </div>
        </div>
      </aside>
    </>
  );
}
