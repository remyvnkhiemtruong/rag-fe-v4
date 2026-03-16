const CA_MAU_SUFFIXES = [/\s*,\s*tỉnh Cà Mau$/i, /\s*,\s*Cà Mau$/i];

export function stripCaMauSuffix(value) {
  if (!value) return '';

  return CA_MAU_SUFFIXES.reduce(
    (currentValue, pattern) => currentValue.replace(pattern, ''),
    String(value).trim()
  );
}

/**
 * Format heritage location for display without repeating the province suffix.
 * @param {{ commune?: string }} item - Heritage item with optional commune
 * @returns {string}
 */
export function formatHeritageLocation(item) {
  return stripCaMauSuffix(item?.commune);
}
