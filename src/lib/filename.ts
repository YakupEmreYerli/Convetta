import { EXTENSION_BY_FORMAT, type TargetFormat } from './formats';

/**
 * Son uzantiyi atar; uzantisiz adlarda ad oldugu gibi kalir. Noktadan once en
 * az bir karakter aranir, boylece ".gitignore" gibi adlar bosaltilmaz.
 */
export function baseName(fileName: string): string {
	const trimmed = fileName.replace(/(.)\.[^./\\]+$/, '$1');
	return trimmed || 'image';
}

export function outputName(fileName: string, format: TargetFormat): string {
	return `${baseName(fileName)}.${EXTENSION_BY_FORMAT[format]}`;
}

/**
 * Ayni cikti adi ikinci kez uretildiginde "ad (2).jpg" seklinde numaralandirir.
 * Iki farkli klasorden gelen logo.png dosyalari ayni hedef formata
 * donusturuldugunde ZIP icinde birbirini ezmesini engeller.
 */
export function uniqueName(name: string, taken: Set<string>): string {
	if (!taken.has(name)) {
		taken.add(name);
		return name;
	}

	const dot = name.lastIndexOf('.');
	const stem = dot > 0 ? name.slice(0, dot) : name;
	const ext = dot > 0 ? name.slice(dot) : '';

	let counter = 2;
	let candidate = `${stem} (${counter})${ext}`;
	while (taken.has(candidate)) {
		counter += 1;
		candidate = `${stem} (${counter})${ext}`;
	}
	taken.add(candidate);
	return candidate;
}

/** Dosya boyutunu insan okunur bicime cevirir (1 KB = 1024 bayt). */
export function formatBytes(bytes: number, locale = 'en'): string {
	if (!Number.isFinite(bytes) || bytes < 0) return '—';
	const units = ['B', 'KB', 'MB', 'GB'];
	let value = bytes;
	let unit = 0;
	while (value >= 1024 && unit < units.length - 1) {
		value /= 1024;
		unit += 1;
	}
	const decimals = unit === 0 || value >= 100 ? 0 : 1;
	return `${value.toFixed(decimals).replace('.', locale === 'tr' ? ',' : '.')} ${units[unit]}`;
}
