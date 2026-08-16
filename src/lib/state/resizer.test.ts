import { describe, expect, it } from 'vitest';
import { ResizerState } from './resizer.svelte';

/**
 * Kilidin dosya secilmeden once de calismasi ve dosya listesi bosaldiginda
 * varsayilan orana donmesi; ikisi de kullanicinin bildirdigi hatalardi.
 */
describe('ResizerState en-boy kilidi', () => {
	it('dosya secilmeden de genislige gore yuksekligi gunceller', () => {
		const state = new ResizerState();
		state.setWidth(1920);
		// Baslangic olculeri 1280x720, yani 16:9.
		expect(state.height).toBe(1080);
	});

	it('yukseklige gore genisligi gunceller', () => {
		const state = new ResizerState();
		state.setHeight(360);
		expect(state.width).toBe(640);
	});

	it('kilit kapaliyken diger kenara dokunmaz', () => {
		const state = new ResizerState();
		state.toggleLock();
		state.setWidth(1000);
		expect(state.height).toBe(720);
	});

	it('gorselden okunan orani kullanir', () => {
		const state = new ResizerState();
		state.ratio = 1;
		state.setWidth(500);
		expect(state.height).toBe(500);
	});

	it('gecersiz ara deger sonrasi yukseklik geride kalmaz', () => {
		const state = new ResizerState();
		// Kullanici kutuyu bosaltiyor: Number('') === 0, gecerli olcu degil.
		state.setWidth(0);
		expect(state.height).toBe(720);

		state.setWidth(1920);
		state.commitWidth();
		expect(state.height).toBe(1080);
	});

	it('gecersiz degerde commit karsi kenari bozmaz', () => {
		const state = new ResizerState();
		state.setWidth(0);
		state.commitWidth();
		expect(state.height).toBe(720);
	});

	it('dosya listesi bosaldiginda varsayilan orana doner', async () => {
		const state = new ResizerState();
		state.ratio = 1;
		state.originalWidth = 500;
		state.originalHeight = 500;

		await state.syncRatioFromFirstFile();

		expect(state.originalWidth).toBe(0);
		state.setWidth(1920);
		expect(state.height).toBe(1080);
	});
});
