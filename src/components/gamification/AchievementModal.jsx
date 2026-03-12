import { useEffect, useState } from 'react';
import { X, Share2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getLocalizedField, normalizeLanguageCode } from '../../utils/i18nField';

// Rarity colors
const RARITY_COLORS = {
  common: {
    bg: 'bg-gray-100 dark:bg-gray-700',
    border: 'border-gray-300 dark:border-gray-600',
    text: 'text-gray-700 dark:text-gray-300',
    glow: '',
  },
  uncommon: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    border: 'border-emerald-400 dark:border-emerald-600',
    text: 'text-emerald-700 dark:text-emerald-300',
    glow: 'shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50',
  },
  rare: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-400 dark:border-blue-600',
    text: 'text-blue-700 dark:text-blue-300',
    glow: 'shadow-lg shadow-blue-200 dark:shadow-blue-900/50',
  },
  epic: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    border: 'border-purple-400 dark:border-purple-600',
    text: 'text-purple-700 dark:text-purple-300',
    glow: 'shadow-xl shadow-purple-300 dark:shadow-purple-900/50',
  },
  legendary: {
    bg: 'bg-gradient-to-br from-heritage-gold-100 to-amber-100 dark:from-heritage-gold-900/30 dark:to-amber-900/30',
    border: 'border-heritage-gold-400 dark:border-heritage-gold-600',
    text: 'text-heritage-gold-700 dark:text-heritage-gold-300',
    glow: 'shadow-2xl shadow-heritage-gold-300 dark:shadow-heritage-gold-900/50 animate-pulse',
  },
};

const RARITY_KEYS = {
  common: 'gamification.rarityCommon',
  uncommon: 'gamification.rarityUncommon',
  rare: 'gamification.rarityRare',
  epic: 'gamification.rarityEpic',
  legendary: 'gamification.rarityLegendary',
};

export function AchievementModal({ achievement, isOpen, onClose, points = 100 }) {
  const { t, i18n } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);
  const languageCode = normalizeLanguageCode(i18n.resolvedLanguage || i18n.language);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !achievement) return null;

  const rarity = RARITY_COLORS[achievement.rarity] || RARITY_COLORS.common;
  const rarityLabel = t(RARITY_KEYS[achievement.rarity] || RARITY_KEYS.common);
  const achievementName = getLocalizedField(achievement, 'name', languageCode, '');
  const achievementDescription = getLocalizedField(achievement, 'description', languageCode, '');

  const handleShare = async () => {
    const text = `🏆 ${t('gamification.newAchievement')} "${achievementName}"`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t('gamification.newAchievement'),
          text: text,
          url: window.location.href,
        });
      } catch {
        // Share cancelled or failed - silent catch
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard?.writeText(text);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all duration-500 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        {/* Decorative top gradient */}
        <div className="h-2 bg-gradient-to-r from-heritage-gold-400 via-heritage-gold-300 to-heritage-gold-400" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Confetti effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <Sparkles className="absolute top-12 left-8 w-6 h-6 text-heritage-gold-400 animate-bounce" style={{ animationDelay: '0s' }} />
            <Sparkles className="absolute top-20 right-12 w-4 h-4 text-heritage-gold-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <Sparkles className="absolute bottom-32 left-12 w-5 h-5 text-heritage-gold-300 animate-bounce" style={{ animationDelay: '0.4s' }} />
            <Sparkles className="absolute bottom-40 right-8 w-4 h-4 text-heritage-gold-400 animate-bounce" style={{ animationDelay: '0.6s' }} />
          </div>

          {/* Title */}
          <div className="mb-6">
            <span className="text-4xl animate-bounce inline-block">🎉</span>
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100 mt-2">
              {t('gamification.newAchievement')}
            </h2>
          </div>

          {/* Achievement icon */}
          <div className="relative inline-block mb-6">
            <div
              className={`w-24 h-24 rounded-2xl ${rarity.bg} ${rarity.border} border-4 flex items-center justify-center ${rarity.glow} transform transition-transform hover:scale-105`}
            >
              <span className="text-5xl">{achievement.icon}</span>
            </div>
            {/* Rarity badge */}
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold ${rarity.bg} ${rarity.text} border ${rarity.border}`}>
              {rarityLabel}
            </div>
          </div>

          {/* Achievement name */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {achievementName}
          </h3>

          {/* Achievement description */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {achievementDescription}
          </p>

          {/* Points earned */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-heritage-gold-100 dark:bg-heritage-gold-900/30 rounded-full mb-6">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-heritage-gold-700 dark:text-heritage-gold-300">
              +{points} {t('gamification.points')}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {t('gamification.share')}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 text-white rounded-xl font-medium hover:from-heritage-red-800 hover:to-heritage-red-900 transition-all"
            >
              {t('gamification.awesome')}
            </button>
          </div>
        </div>

        {/* Decorative bottom gradient */}
        <div className="h-1 bg-gradient-to-r from-heritage-red-600 via-heritage-gold-500 to-heritage-red-600" />
      </div>
    </div>
  );
}

export default AchievementModal;
