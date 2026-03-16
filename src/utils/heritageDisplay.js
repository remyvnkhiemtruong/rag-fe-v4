export function hasRecognizedYear(value) {
  if (value === null || value === undefined) return false;

  const normalized = String(value).trim();
  return normalized !== '' && normalized !== '0' && normalized.toUpperCase() !== 'N/A';
}
