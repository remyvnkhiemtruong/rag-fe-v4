/**
 * Format heritage location for display: "xã/phường, tỉnh Cà Mau".
 * Province is always taken from i18n (common.provinceNameCaMau), not from API.
 * @param {{ commune?: string }} item - Heritage item with optional commune
 * @param {(key: string) => string} t - i18n translate function
 * @returns {string}
 */
export function formatHeritageLocation(item, t) {
  if (!item?.commune?.trim()) return '';
  const province = t('common.provinceNameCaMau') || 'tỉnh Cà Mau';
  return `${item.commune.trim()}, ${province}`;
}
