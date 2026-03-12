import { Menu, Landmark, Globe, ChevronDown, Moon, Sun, Type, Minus, Plus, Search, X } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import heritageData from '../data/heritages.json';
import { PEOPLE_DATA } from '../data/people';
import { FESTIVAL_DATA } from '../data/festivals';

export function Header({ onMenuClick }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguage, changeLanguage, languages, getCurrentLanguageInfo } = useLanguage();
  const { isDarkMode, toggleDarkMode, fontSize, fontSizes, changeFontSize, increaseFontSize, decreaseFontSize, getCurrentFontSize } = useTheme();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isFontOpen, setIsFontOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const langRef = useRef(null);
  const fontRef = useRef(null);
  const searchRef = useRef(null);

  const currentLangInfo = getCurrentLanguageInfo();
  const currentFontInfo = getCurrentFontSize();
  const fontSizeLabelKeyMap = {
    small: 'settings.fontSmall',
    normal: 'settings.fontNormal',
    large: 'settings.fontLarge',
    xlarge: 'settings.fontXLarge',
  };
  const getFontSizeLabel = (sizeOption) => {
    const key = fontSizeLabelKeyMap[sizeOption?.id];
    if (!key) return sizeOption?.label || '';
    const translated = t(key);
    return translated === key ? (sizeOption?.label || '') : translated;
  };
  const getLanguageLabel = (langCode, fallback = '') => {
    const key = `language.${langCode}`;
    const translated = t(key);
    return translated === key ? fallback : translated;
  };

  // Combine all heritage data
  const allData = useMemo(() => [
    ...heritageData.map(item => ({ ...item, dataType: 'heritage' })),
    ...PEOPLE_DATA.map(item => ({ ...item, dataType: 'people' })),
    ...FESTIVAL_DATA.map(item => ({ ...item, dataType: 'festival' }))
  ], []);

  // Filter heritage items based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return allData
      .filter(item =>
        item.name?.toLowerCase().includes(query) ||
        item.address?.toLowerCase().includes(query) ||
        item.commune?.toLowerCase().includes(query)
      )
      .slice(0, 5); // Limit to 5 suggestions
  }, [searchQuery, allData]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
      if (fontRef.current && !fontRef.current.contains(event.target)) {
        setIsFontOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsLangOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsSearchOpen(true);
  };

  const handleSearchSelect = (item) => {
    // Navigate to heritage detail page
    navigate(`/heritage/${item.id}`);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-heritage-red-800 via-heritage-red-700 to-heritage-red-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white shadow-lg relative theme-transition">
      {/* Gold accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-heritage-gold-400 via-heritage-gold-300 to-heritage-gold-400" />

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Left side - Menu button + Logo */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-heritage-red-600 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
              aria-label={t('common.system')}
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Logo with Link to Home */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0 hover:opacity-90 transition-opacity">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-heritage-gold-500 flex items-center justify-center shadow-md">
                  <Landmark className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-heritage-red-800 dark:text-gray-900" />
                </div>
              </div>

              {/* Title */}
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight truncate">
                  <span className="font-serif">{t('header.heritage')}</span>
                  <span className="hidden sm:inline text-heritage-gold-300 font-normal mx-2">—</span>
                  <span className="hidden sm:inline text-heritage-gold-300 font-normal text-sm sm:text-base md:text-lg lg:text-xl">
                    {t('header.location')}
                  </span>
                </h1>
                {/* Mobile subtitle */}
                <p className="sm:hidden text-xs text-heritage-gold-300 truncate">
                  {t('header.location')}
                </p>
              </div>
            </Link>
          </div>

          {/* Center - Search Bar (hidden on very small screens) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchOpen(true)}
                placeholder={t('search.placeholder')}
                className="w-full px-4 py-2 pl-10 pr-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20
                          text-white placeholder-white/60 focus:bg-white/20 focus:border-white/40
                          focus:outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              {searchQuery && (
                <button
                  onClick={handleSearchClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fade-in max-h-96 overflow-y-auto">
                {searchResults.map((item) => (
                  <button
                    key={`${item.dataType}-${item.id}`}
                    onClick={() => handleSearchSelect(item)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Landmark className="w-5 h-5 text-heritage-red-600 dark:text-heritage-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.address}
                      </p>
                      {item.rankingType && (
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-heritage-red-100 dark:bg-heritage-red-900/30 text-heritage-red-700 dark:text-heritage-red-300">
                          {item.rankingType}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20 hover:border-white/30"
              aria-label={t('common.searchAria')}
              title={t('search.placeholder')}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-heritage-gold-300" />
            </button>

            {/* Font Size Control */}
            <div className="relative hidden sm:block" ref={fontRef}>
              <button
                onClick={() => setIsFontOpen(!isFontOpen)}
                className="flex items-center gap-1 px-2 py-1.5 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20 hover:border-white/30"
                aria-label={t('settings.fontSize')}
                title={t('settings.fontSize')}
              >
                <Type className="w-4 h-4 text-heritage-gold-300" />
                <span className="text-xs font-medium hidden md:inline">{getFontSizeLabel(currentFontInfo)}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isFontOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Font Size Dropdown */}
              {isFontOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={() => setIsFontOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {t('settings.fontSize') || 'Font Size'}
                      </p>
                    </div>

                    {/* Quick adjust buttons */}
                    <div className="px-3 py-2 flex items-center justify-center gap-3 border-b border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => decreaseFontSize()}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        disabled={fontSize === 'small'}
                      >
                        <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[80px] text-center">
                        {getFontSizeLabel(currentFontInfo)}
                      </span>
                      <button
                        onClick={() => increaseFontSize()}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        disabled={fontSize === 'xlarge'}
                      >
                        <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>

                    {fontSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => {
                          changeFontSize(size.id);
                          setIsFontOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          fontSize === size.id
                            ? 'bg-heritage-red-50 dark:bg-heritage-red-900/30 text-heritage-red-700 dark:text-heritage-red-300'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="text-sm" style={{ fontSize: `${size.scale * 14}px` }}>Aa</span>
                        <span className="text-sm font-medium flex-1">{getFontSizeLabel(size)}</span>
                        {fontSize === size.id && (
                          <svg className="w-4 h-4 text-heritage-red-600 dark:text-heritage-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20 hover:border-white/30"
              aria-label={isDarkMode ? t('settings.lightMode') : t('settings.darkMode')}
              title={isDarkMode ? t('settings.lightMode') : t('settings.darkMode')}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-heritage-gold-300" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-heritage-gold-300" />
              )}
            </button>

            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20 hover:border-white/30"
                aria-label={t('language.select')}
              >
                <Globe className="w-4 h-4 text-heritage-gold-300" />
                <span className="text-base sm:text-lg">{currentLangInfo.flag}</span>
                <span className="hidden md:inline text-sm font-medium">
                  {getLanguageLabel(currentLangInfo.code, currentLangInfo.name)}
                </span>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Dropdown */}
              {isLangOpen && (
                <>
                  {/* Backdrop for mobile */}
                  <div
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={() => setIsLangOpen(false)}
                  />

                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {t('language.select')}
                      </p>
                    </div>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          currentLanguage === lang.code
                            ? 'bg-heritage-red-50 dark:bg-heritage-red-900/30 text-heritage-red-700 dark:text-heritage-red-300'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-sm font-medium flex-1">
                          {getLanguageLabel(lang.code, lang.name)}
                        </span>
                        {currentLanguage === lang.code && (
                          <svg className="w-4 h-4 text-heritage-red-600 dark:text-heritage-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {isSearchOpen && (
          <div className="md:hidden mt-3 relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={t('search.placeholder')}
                className="w-full px-4 py-2 pl-10 pr-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20
                          text-white placeholder-white/60 focus:bg-white/20 focus:border-white/40
                          focus:outline-none transition-all"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              {searchQuery && (
                <button
                  onClick={handleSearchClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 max-h-64 overflow-y-auto">
                {searchResults.map((item) => (
                  <button
                    key={`${item.dataType}-${item.id}`}
                    onClick={() => handleSearchSelect(item)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Landmark className="w-5 h-5 text-heritage-red-600 dark:text-heritage-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.address}
                      </p>
                      {item.rankingType && (
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-heritage-red-100 dark:bg-heritage-red-900/30 text-heritage-red-700 dark:text-heritage-red-300">
                          {item.rankingType}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
