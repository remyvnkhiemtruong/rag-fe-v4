const LANGUAGE_SUFFIX_MAP = {
  en: 'En',
  zh: 'Zh',
  km: 'Km',
};

export function normalizeLanguageCode(rawLanguage) {
  if (!rawLanguage || typeof rawLanguage !== 'string') {
    return 'vi';
  }
  return rawLanguage.toLowerCase().split('-')[0] || 'vi';
}

const getFallbackFieldNames = (baseField, languageCode) => {
  const selectedSuffix = LANGUAGE_SUFFIX_MAP[languageCode];
  const selectedField = selectedSuffix ? `${baseField}${selectedSuffix}` : baseField;

  const orderedFields = [
    selectedField,
    baseField,
    `${baseField}En`,
    `${baseField}Zh`,
    `${baseField}Km`,
  ];

  return [...new Set(orderedFields)];
};

export function getLocalizedField(item, baseField, rawLanguage, fallbackValue = '') {
  if (!item) return fallbackValue;

  const languageCode = normalizeLanguageCode(rawLanguage);
  const candidateFields = getFallbackFieldNames(baseField, languageCode);

  for (const fieldName of candidateFields) {
    const value = item[fieldName];
    if (typeof value === 'string' && value.trim() !== '') {
      return value;
    }
  }

  return fallbackValue;
}

export function getLocalizedArrayField(item, baseField, rawLanguage, fallbackValue = [], expectedLength = null) {
  if (!item) return fallbackValue;

  const languageCode = normalizeLanguageCode(rawLanguage);
  const candidateFields = getFallbackFieldNames(baseField, languageCode);

  for (const fieldName of candidateFields) {
    const value = item[fieldName];
    if (!Array.isArray(value)) continue;
    if (expectedLength !== null && value.length !== expectedLength) continue;
    return value;
  }

  return fallbackValue;
}

export { LANGUAGE_SUFFIX_MAP };
