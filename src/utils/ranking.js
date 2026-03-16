export const RANKING_CODES = {
  NATIONAL_SPECIAL: 'nationalSpecial',
  NATIONAL: 'national',
  PROVINCIAL: 'provincial',
};

const ZH_SPECIAL = '\u56fd\u5bb6\u7279\u522b';
const ZH_NATIONAL = '\u56fd\u5bb6';
const ZH_PROVINCIAL = '\u7701\u7ea7';

function normalizeRankingValue(raw) {
  if (raw === null || raw === undefined) return '';

  return String(raw)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const UNRANKED_VALUES = new Set([
  '',
  'khong',
  'khong xep hang',
  'none',
  'no ranking',
  'unranked',
  'n/a',
  'na',
]);

export function isUnrankedRanking(raw) {
  const normalized = normalizeRankingValue(raw);
  return UNRANKED_VALUES.has(normalized);
}

export function hasDisplayableRanking(raw) {
  return !isUnrankedRanking(raw);
}

export function normalizeRankingCode(raw) {
  if (!raw || typeof raw !== 'string' || isUnrankedRanking(raw)) return null;

  const lower = raw.toLowerCase().trim();
  const normalized = normalizeRankingValue(raw);

  if (
    normalized.includes('quoc gia dac biet') ||
    normalized.includes('national special') ||
    normalized.includes('special national') ||
    lower.includes(ZH_SPECIAL)
  ) {
    return RANKING_CODES.NATIONAL_SPECIAL;
  }

  if (
    normalized === 'quoc gia' ||
    normalized === 'national' ||
    (normalized.includes('quoc gia') && !normalized.includes('dac biet')) ||
    lower.includes(ZH_NATIONAL)
  ) {
    return RANKING_CODES.NATIONAL;
  }

  if (
    normalized.includes('cap tinh') ||
    normalized.includes('provincial') ||
    lower.includes(ZH_PROVINCIAL)
  ) {
    return RANKING_CODES.PROVINCIAL;
  }

  return null;
}

const STYLES = {
  nationalSpecial: {
    badge:
      'bg-heritage-red-100 dark:bg-heritage-red-900/50 text-heritage-red-800 dark:text-heritage-red-200 border-heritage-red-300 dark:border-heritage-red-700',
    badgeSolid:
      'bg-heritage-red-600 text-white border-heritage-red-500 dark:bg-heritage-red-600 dark:text-white dark:border-heritage-red-500',
    badgeCompact: 'bg-heritage-red-600 text-white',
    accent: 'from-heritage-red-600 to-heritage-red-700',
    gradient: 'from-heritage-red-600 to-heritage-red-800',
    gradientBar: 'from-heritage-red-700 via-heritage-red-600 to-heritage-red-700',
  },
  national: {
    badge:
      'bg-heritage-gold-100 dark:bg-heritage-gold-900/50 text-heritage-gold-800 dark:text-heritage-gold-200 border-heritage-gold-300 dark:border-heritage-gold-700',
    badgeSolid:
      'bg-heritage-gold-500 text-heritage-red-950 border-heritage-gold-400 dark:bg-heritage-gold-500 dark:text-heritage-red-950 dark:border-heritage-gold-400',
    badgeCompact: 'bg-heritage-gold-500 text-heritage-red-900',
    accent: 'from-heritage-gold-500 to-heritage-gold-600',
    gradient: 'from-heritage-gold-500 to-heritage-gold-700',
    gradientBar: 'from-heritage-gold-600 via-heritage-gold-500 to-heritage-gold-600',
  },
  provincial: {
    badge:
      'bg-heritage-jade-100 dark:bg-emerald-900/50 text-heritage-jade-800 dark:text-emerald-200 border-heritage-jade-300 dark:border-emerald-700',
    badgeSolid:
      'bg-emerald-600 text-white border-emerald-500 dark:bg-emerald-600 dark:text-white dark:border-emerald-500',
    badgeCompact: 'bg-green-600 text-white',
    accent: 'from-heritage-jade-500 to-heritage-jade-600',
    gradient: 'from-green-500 to-green-700',
    gradientBar: 'from-heritage-jade-600 via-heritage-jade-500 to-heritage-jade-600',
  },
};

const DEFAULT_STYLE = {
  badge:
    'bg-heritage-earth-100 dark:bg-gray-700 text-heritage-earth-700 dark:text-gray-300 border-heritage-earth-300 dark:border-gray-600',
  badgeSolid:
    'bg-gray-700 text-white border-gray-600 dark:bg-gray-700 dark:text-white dark:border-gray-600',
  badgeCompact: 'bg-gray-600 text-white',
  accent: 'from-heritage-earth-400 to-heritage-earth-500',
  gradient: 'from-gray-600 to-gray-800',
  gradientBar: 'from-heritage-earth-500 to-heritage-earth-600',
};

export function getRankingStyle(raw) {
  const code = normalizeRankingCode(raw);
  return code ? STYLES[code] : DEFAULT_STYLE;
}

export function getRankingCode(raw) {
  return normalizeRankingCode(raw);
}
