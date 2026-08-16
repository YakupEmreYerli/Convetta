<script lang="ts">
	import { ACCEPTED_INPUT_TYPES } from '$lib/formats';
	import { getLocale } from '$lib/state/locale.svelte';

	const locale = getLocale();

	interface Props {
		onfiles: (files: FileList | File[]) => void;
		disabled?: boolean;
	}

	let { onfiles, disabled = false }: Props = $props();

	let input = $state<HTMLInputElement | null>(null);
	let dragging = $state(false);
	// dragenter/dragleave ic ogeler uzerinde de tetiklenir; sayac olmadan
	// imlec bir cocuk ogenin uzerine geldiginde vurgu titrer.
	let dragDepth = 0;

	function open() {
		if (!disabled) input?.click();
	}

	function onDragEnter(event: DragEvent) {
		event.preventDefault();
		dragDepth += 1;
		dragging = true;
	}

	function onDragLeave(event: DragEvent) {
		event.preventDefault();
		dragDepth = Math.max(0, dragDepth - 1);
		if (dragDepth === 0) dragging = false;
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		dragDepth = 0;
		dragging = false;
		if (disabled) return;
		const dropped = event.dataTransfer?.files;
		if (dropped && dropped.length > 0) onfiles(dropped);
	}

	function onChange() {
		if (input?.files && input.files.length > 0) onfiles(input.files);
		// Ayni dosya art arda secilebilsin diye deger sifirlanir.
		if (input) input.value = '';
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			open();
		}
	}
</script>

<div
	role="button"
	tabindex={disabled ? -1 : 0}
	aria-label={locale.dict.drop.label}
	aria-disabled={disabled}
	id="drop-zone"
	class="flex flex-grow cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center
		{disabled ? 'cursor-not-allowed opacity-60' : ''}
		{dragging
		? 'border-blue-500 bg-blue-50 dark:bg-slate-700'
		: 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:border-slate-600 dark:hover:bg-slate-700/60'}"
	onclick={open}
	onkeydown={onKeydown}
	ondragenter={onDragEnter}
	ondragover={(e) => e.preventDefault()}
	ondragleave={onDragLeave}
	ondrop={onDrop}
>
	<div id="drop-text" class="font-medium text-gray-500 dark:text-slate-300">
		{locale.dict.drop.title}
		<span class="font-bold text-blue-500 dark:text-blue-400">{locale.dict.drop.browse}</span>
	</div>

	<input
		bind:this={input}
		id="fileInput"
		type="file"
		class="sr-only"
		accept={ACCEPTED_INPUT_TYPES.join(',')}
		multiple
		{disabled}
		tabindex="-1"
		aria-hidden="true"
		onchange={onChange}
	/>
</div>
