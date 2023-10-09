<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let options: { label: string; value: string }[] = [];
	export let value: string;

	let className: string;
	export { className as class };

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('click');
	}

	function handleBlur() {
		dispatch('blur');
	}

	function handleChange(event: Event) {
		value = (event.target as HTMLSelectElement).value;
		dispatch('change', value);
	}

	let selectedOption: { label: string; value: string } | undefined;
	$: selectedOption = options.find((option) => option.value === value);
</script>

<select
	bind:value
	on:change={handleChange}
	on:click={handleClick}
	on:blur={handleBlur}
	aria-label="Select an option"
	aria-selected={selectedOption ? 'true' : 'false'}
	style="select"
	class={className}
>
	{#each options as option (option.value)}
		<option value={option.value} selected={option.value === value}>
			{option.label}
		</option>
	{/each}
</select>
