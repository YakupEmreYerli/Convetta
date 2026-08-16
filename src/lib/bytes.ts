/**
 * Dosya boyutu etiketi. Es iki yerde kullaniliyor (secilen dosyalar ve
 * sonuclar), bu yuzden tek noktada duruyor.
 *
 * 1 MB altinda KB, ustunde MB gosteriliyor: 4823.55 KB gibi bir deger
 * okunabilir degil.
 */
export function formatBytes(bytes: number): string {
	if (!Number.isFinite(bytes) || bytes < 0) return '';
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
