import { browser } from '$app/environment';

const STORAGE_KEY = 'convetta:theme';

export type Theme = 'light' | 'dark';

class ThemeState {
	current = $state<Theme>('light');

	/**
	 * app.html icindeki satir ici betik `dark` sinifini ilk boyamadan once
	 * ekliyor; burada yalnizca o karar okunup rune durumuna aktariliyor.
	 */
	init() {
		if (!browser) return;
		this.current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
	}

	toggle() {
		this.set(this.current === 'dark' ? 'light' : 'dark');
	}

	set(theme: Theme) {
		this.current = theme;
		if (!browser) return;
		const root = document.documentElement;
		// Tüm yüzeyler aynı geçiş bağlamında değerlendirilir; aksi halde
		// bileşenlerin kendi transition süreleri sıra sıra görünür.
		root.classList.add('theme-switching');
		root.classList.toggle('dark', theme === 'dark');
		window.setTimeout(() => root.classList.remove('theme-switching'), 180);
		try {
			localStorage.setItem(STORAGE_KEY, theme);
		} catch {
			/* kalici saklama basarisizsa tema yalnizca bu oturumda gecerli olur */
		}
	}
}

export const theme = new ThemeState();
