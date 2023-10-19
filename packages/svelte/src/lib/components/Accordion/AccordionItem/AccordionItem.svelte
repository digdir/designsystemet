<script>
	import { setContext, createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import { v4 as uuidv4 } from 'uuid';

	export let open = writable(undefined);
	export let defaultOpen = false;

	let internalOpen = writable(defaultOpen);
	let contentId = uuidv4();
	const dispatch = createEventDispatcher();

	const toggleOpen = () => {
		if (open === undefined) {
			internalOpen.update((iOpen) => !iOpen);
		}
		$open = !$open;
		dispatch('toggleOpen');
	};

	setContext('accordionItem', { open: open ?? $internalOpen, toggleOpen, contentId });
</script>

<div class="item" class:open={open || internalOpen}>
	<slot />
</div>

<style>
	.item:focus-within {
		position: relative;
	}
</style>
