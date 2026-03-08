import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

import {
  Home, BookOpen, Map, MessageSquare, Gamepad2, Settings,
  Globe, Moon, Sun
} from 'lucide-react';

export default function FloatingNavbar() {
  const { t } = useTranslation();
  const { currentLanguage: _currentLanguage, changeLanguage: _changeLanguage } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [_isLangOpen, _setIsLangOpen] = useState(false);
  useTheme(); // theme applied via class on document
  const langRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, labelKey: 'nav.home' },
    { path: '/heritage', icon: BookOpen, labelKey: 'nav.heritage' },
    { path: '/map', icon: Map, labelKey: 'nav.map' },
    { path: '/chat', icon: MessageSquare, labelKey: 'nav.chat' },
    { path: '/quiz', icon: Gamepad2, labelKey: 'nav.quiz' },
    { path: '/settings', icon: Settings, labelKey: 'nav.settings' },
  ];

  const _languages = [
    { code: 'vi', nameKey: 'language.vi', flag: '🇻🇳' },
    { code: 'en', nameKey: 'language.en', flag: '🇺🇸' },
    { code: 'zh', nameKey: 'language.zh', flag: '🇨🇳' },
    { code: 'km', nameKey: 'language.km', flag: '🇰🇭' },
  ];

  useEffect(() => {
    const currentIndex = navItems.findIndex(item =>
      item.path === '/'
        ? location.pathname === '/'
        : item.path === '/settings'
          ? location.pathname === '/settings'
          : location.pathname.startsWith(item.path)
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- navItems is stable
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        _setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLabel = (labelKey) => t(labelKey) || labelKey;

  const handleNavClick = (index) => {
    setActiveIndex(index);
    navigate(navItems[index].path); // Actually navigate!
  };


  return (
    <>
      {/* Logo GDĐP Cà Mau - góc dưới trái */}
      <div
        className="fixed z-40 left-2 bottom-24 md:bottom-4 md:left-4"
        aria-hidden
      >
        <img
          src="/logo-camau.svg"
          alt={t('common.logoAlt')}
          className="h-10 w-auto md:h-12 opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(100%);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .nav-enter {
          animation: slideUp 0.3s ease-out forwards;
        }

        .nav-exit {
          animation: slideDown 0.3s ease-out forwards;
        }

        .overlay-enter {
          animation: fadeIn 0.2s ease-out forwards;
        }

        .overlay-exit {
          animation: fadeOut 0.2s ease-out forwards;
        }
      `}</style>

      {/* Desktop Floating Nav */}
      <nav className="hidden md:flex fixed bottom-3 md:bottom-4 left-0 right-0 z-50">
        <div className="w-full max-w-[1100px] mx-auto px-2 flex justify-center">
          <div className="inline-flex items-center justify-between gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 rounded-2xl md:rounded-full px-2.5 py-1.5 md:px-4 md:py-2 shadow-[0_12px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
            {/* Logo + GDĐP Tỉnh Cà Mau (không có chữ CM) */}
            <button
              onClick={() => handleNavClick(0)}
              className="flex items-center gap-1.5 pr-3 mr-1 border-r border-gray-200/50 dark:border-gray-700/50 shrink-0 max-w-[45%]"
            >
              <img src="/logo-camau.svg" alt={t('common.logoAlt')} className="h-7 w-auto md:h-8" />
              <span className="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-100 font-display tracking-tight whitespace-nowrap overflow-hidden text-ellipsis hidden sm:inline">
                GDĐP {t('common.appSubtitle')}
              </span>
            </button>

            {/* Nav Items */}
            <div className="flex items-center gap-0.5 flex-wrap justify-center flex-1 min-w-0">
              {navItems.map(({ icon: Icon, labelKey }, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleNavClick(index)}
                    className={`inline-flex items-center gap-1.5 px-2 py-1.5 md:px-3 md:py-2 rounded-full transition-all duration-200 shrink-0 ${isActive
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-red-700 dark:text-yellow-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    style={{ transform: isActive ? 'scale(0.96)' : 'scale(1)' }}
                  >
                    <Icon className={`w-4 h-4 md:w-4.5 md:h-4.5 shrink-0 ${isActive ? 'stroke-[2.5]' : ''}`} fill={isActive ? 'currentColor' : 'none'} />
                    <span className="text-[11px] md:text-xs font-medium whitespace-nowrap">{getLabel(labelKey)}</span>
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200/50 dark:bg-gray-700/50 mx-1" />

            {/* Theme Toggle */}
            {/* <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
              aria-label={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button> */}

            {/* Language Dropdown */}
            {/* <div ref={langRef} className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-medium">{currentLang?.flag}</span>
              </button>
              
              {isLangOpen && (
                <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 min-w-[140px]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { changeLanguage(lang.code); setIsLangOpen(false); }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                        currentLanguage === lang.code ? 'text-red-600 dark:text-yellow-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{t(lang.nameKey)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div> */}
          </div>
        </div>
      </nav>

      {/* Mobile Floating Nav - 6 items, balanced */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
        <div className="px-2 sm:px-3 pb-2 sm:pb-3 pt-1">
          <div className="flex items-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Navigation items */}
            <div className="flex items-center justify-around relative z-10 w-full py-2 px-0.5 sm:py-2.5">
              {navItems.map(({ icon: Icon, labelKey }, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleNavClick(index)}
                    className={`flex flex-col items-center justify-center flex-1 min-w-0 px-0.5 py-1.5 sm:py-2 relative min-h-[46px] sm:min-h-[52px] overflow-hidden rounded-xl transition-colors ${isActive ? 'bg-red-500' : ''}`}
                  >
                    <Icon
                      className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 shrink-0 ${isActive
                        ? 'text-white stroke-[2.5]'
                        : 'text-gray-500 dark:text-gray-400 stroke-[2]'
                      }`}
                      fill={isActive ? 'currentColor' : 'none'}
                    />
                    <span className={`text-[9px] sm:text-[10px] mt-0.5 sm:mt-1 font-medium leading-tight truncate max-w-full px-0.5 ${isActive ? 'text-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                      {getLabel(labelKey)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
