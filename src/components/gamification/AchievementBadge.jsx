import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';
import { getLocalizedField, normalizeLanguageCode } from '../../utils/i18nField';

// Rarity styles
const RARITY_STYLES = {
  common: {
    bg: 'bg-gray-100 dark:bg-gray-700',
    border: 'border-gray-300 dark:border-gray-600',
    ring: 'ring-gray-200 dark:ring-gray-600',
    text: 'text-gray-600 dark:text-gray-400',
  },
  uncommon: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-300 dark:border-emerald-700',
    ring: 'ring-emerald-200 dark:ring-emerald-800',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  rare: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-300 dark:border-blue-700',
    ring: 'ring-blue-200 dark:ring-blue-800',
    text: 'text-blue-600 dark:text-blue-400',
  },
  epic: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-300 dark:border-purple-700',
    ring: 'ring-purple-200 dark:ring-purple-800',
    text: 'text-purple-600 dark:text-purple-400',
  },
  legendary: {
    bg: 'bg-gradient-to-br from-heritage-gold-50 to-amber-50 dark:from-heritage-gold-900/20 dark:to-amber-900/20',
    border: 'border-heritage-gold-400 dark:border-heritage-gold-600',
    ring: 'ring-heritage-gold-200 dark:ring-heritage-gold-800',
    text: 'text-heritage-gold-600 dark:text-heritage-gold-400',
  },
};

/**
 * AchievementBadge Component
 * Displays a single achievement badge
 */
export function AchievementBadge({
  achievement,
  unlocked = false,
  size = 'medium',
  showLabel = true,
  onClick
}) {
  const { i18n } = useTranslation();
  const languageCode = normalizeLanguageCode(i18n.resolvedLanguage || i18n.language);

  const rarity = RARITY_STYLES[achievement.rarity] || RARITY_STYLES.common;

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20',
  };

  const iconSizes = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-4xl',
  };

  return (
    <div
      className={`flex flex-col items-center gap-2 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Badge */}
      <div
        className={`relative ${sizeClasses[size]} rounded-xl border-2 flex items-center justify-center transition-all ${
          unlocked
            ? `${rarity.bg} ${rarity.border} hover:ring-2 ${rarity.ring} hover:scale-105`
            : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }`}
      >
        {unlocked ? (
          <span className={iconSizes[size]}>{achievement.icon}</span>
        ) : (
          <Lock className={`${size === 'small' ? 'w-4 h-4' : 'w-6 h-6'} text-gray-400 dark:text-gray-500`} />
        )}

        {/* Glow effect for legendary */}
        {unlocked && achievement.rarity === 'legendary' && (
          <div className="absolute inset-0 rounded-xl bg-heritage-gold-400/20 animate-pulse" />
        )}
      </div>

      {/* Label */}
      {showLabel && (
        <div className="text-center max-w-[80px]">
          <p className={`text-xs font-medium truncate ${
            unlocked
              ? 'text-gray-700 dark:text-gray-300'
              : 'text-gray-400 dark:text-gray-500'
          }`}>
            {unlocked
              ? getLocalizedField(achievement, 'name', languageCode, '???')
              : '???'
            }
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * AchievementGrid Component
 * Displays a grid of achievements
 */
export function AchievementGrid({
  achievements,
  unlockedIds = [],
  columns = 4,
  size = 'medium',
  showLabels = true,
  onAchievementClick
}) {
  const gridCols = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  return (
    <div className={`grid ${gridCols[columns] || 'grid-cols-4'} gap-4`}>
      {achievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          unlocked={unlockedIds.includes(achievement.id)}
          size={size}
          showLabel={showLabels}
          onClick={() => onAchievementClick?.(achievement)}
        />
      ))}
    </div>
  );
}

/**
 * AchievementCard Component
 * Larger card view of an achievement with description
 */
export function AchievementCard({ achievement, unlocked = false, onClick }) {
  const { t, i18n } = useTranslation();
  const languageCode = normalizeLanguageCode(i18n.resolvedLanguage || i18n.language);

  const rarity = RARITY_STYLES[achievement.rarity] || RARITY_STYLES.common;

  const RARITY_KEYS = {
    common: 'gamification.rarityCommon',
    uncommon: 'gamification.rarityUncommon',
    rare: 'gamification.rarityRare',
    epic: 'gamification.rarityEpic',
    legendary: 'gamification.rarityLegendary',
  };
  const label = t(RARITY_KEYS[achievement.rarity] || RARITY_KEYS.common);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border-2 p-4 transition-all ${
        unlocked
          ? `${rarity.bg} ${rarity.border} hover:shadow-lg cursor-pointer`
          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center flex-shrink-0 ${
            unlocked
              ? `bg-white dark:bg-gray-800 ${rarity.border}`
              : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
          }`}
        >
          {unlocked ? (
            <span className="text-3xl">{achievement.icon}</span>
          ) : (
            <Lock className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold ${
              unlocked ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
            }`}>
              {unlocked
                ? getLocalizedField(achievement, 'name', languageCode, t('gamification.notUnlocked'))
                : t('gamification.notUnlocked')
              }
            </h3>
            {unlocked && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${rarity.bg} ${rarity.text}`}>
                {label}
              </span>
            )}
          </div>
          <p className={`text-sm ${
            unlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'
          }`}>
            {unlocked
              ? getLocalizedField(achievement, 'description', languageCode, '')
              : t('gamification.notUnlocked')
            }
          </p>
        </div>
      </div>

      {/* Legendary glow */}
      {unlocked && achievement.rarity === 'legendary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-heritage-gold-400/10 to-amber-400/10 pointer-events-none" />
      )}
    </div>
  );
}

/**
 * AchievementProgress Component
 * Shows progress toward achievements
 */
export function AchievementProgress({ totalAchievements, unlockedCount }) {
  const { t } = useTranslation();

  const percentage = totalAchievements > 0
    ? Math.round((unlockedCount / totalAchievements) * 100)
    : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          {t('gamification.achievements')}
        </span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {unlockedCount} / {totalAchievements}
        </span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-heritage-red-600 to-heritage-gold-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        {percentage}% {t('gamification.complete')}
      </p>
    </div>
  );
}

export default AchievementBadge;
