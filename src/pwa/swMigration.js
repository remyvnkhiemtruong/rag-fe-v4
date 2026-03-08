const SW_MIGRATION_DONE_KEY = 'sw-migration-v1-done';
const LEGACY_CACHE_PREFIX = 'heritage-';
const LEGACY_CACHE_NAMES = [
  'heritage-web-v1',
  'heritage-runtime-v1',
  'heritage-images-v1',
  'heritage-data-v1',
];

const hasBrowserSupport = () =>
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  'caches' in window &&
  typeof localStorage !== 'undefined';

const isLegacyCache = (cacheName) =>
  LEGACY_CACHE_NAMES.includes(cacheName) || cacheName.startsWith(LEGACY_CACHE_PREFIX);

/**
 * One-time migration for users with legacy custom SW/cache state.
 * We only run cleanup when legacy cache names exist.
 */
export async function runServiceWorkerMigration() {
  if (!hasBrowserSupport()) return;
  if (localStorage.getItem(SW_MIGRATION_DONE_KEY) === '1') return;

  try {
    const cacheNames = await caches.keys();
    const legacyCaches = cacheNames.filter(isLegacyCache);

    if (legacyCaches.length === 0) {
      localStorage.setItem(SW_MIGRATION_DONE_KEY, '1');
      return;
    }

    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
    await Promise.all(legacyCaches.map((cacheName) => caches.delete(cacheName)));

    localStorage.setItem(SW_MIGRATION_DONE_KEY, '1');
    window.location.reload();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[PWA] Legacy SW migration failed:', error);
    }
  }
}

