// Le Parfum — "Vistos recientemente"

const STORAGE_KEY = 'leparfum_recent';
const MAX_ITEMS = 6;

export function trackView(slug: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    let slugs: string[] = raw ? JSON.parse(raw) : [];
    slugs = slugs.filter((s) => s !== slug);
    slugs.unshift(slug);
    slugs = slugs.slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // localStorage no disponible — no es crítico, simplemente no se guarda el historial.
  }
}

export function getRecentlyViewed(excludeSlug?: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const slugs: string[] = raw ? JSON.parse(raw) : [];
    return excludeSlug ? slugs.filter((s) => s !== excludeSlug) : slugs;
  } catch {
    return [];
  }
}
