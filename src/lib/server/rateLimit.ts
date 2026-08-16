/**
 * Donusum CPU-yogun ve ucun kimlik dogrulamasi yok: IP basina kayan pencere ile
 * sinirlaniyor. Amac kotu niyetli kullanimi tam engellemek degil, tek bir
 * istemcinin konteyneri doyurmasini onlemek.
 */
const WINDOW_MS = 60_000;
const MAX_HITS = 30;
const buckets = new Map<string, number[]>();

export function rateLimited(ip: string, now = Date.now()): boolean {
	const hits = (buckets.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
	hits.push(now);
	buckets.set(ip, hits);

	// Harita sinirsiz buyumesin: eski kayitlar ara sira toplu temizleniyor.
	if (buckets.size > 5000) {
		for (const [key, times] of buckets) {
			if (!times.length || now - times[times.length - 1] > WINDOW_MS) buckets.delete(key);
		}
	}

	return hits.length > MAX_HITS;
}

/**
 * IP basina hiz siniri tek bir istemciyi yavaslatir ama es zamanli is yukunu
 * sinirlamaz: dakikada 30 istek hakki, 30 magick surecinin ayni anda
 * calismasina izin verir. Kuyruk tutmuyoruz - beklemek yerine 503 + Retry-After
 * dondurmek, istemcinin zaman asimina ugramasindan daha durust.
 */
const MAX_CONCURRENT = 4;
let active = 0;

export function tryAcquireSlot(): boolean {
	if (active >= MAX_CONCURRENT) return false;
	active += 1;
	return true;
}

export function releaseSlot(): void {
	active = Math.max(0, active - 1);
}

/** Testler icin sayaclari sifirlar. */
export function resetLimits(): void {
	buckets.clear();
	active = 0;
}
