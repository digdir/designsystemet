<script lang="ts">
	import { onMount } from 'svelte';

	export let options: { value: string; label: string }[];
	export let value: string;
	export let onInput: (value: string) => void;

	let selectedOption = options.find((option) => option.value === value);

	onMount(() => {
		selectedOption = options.find((option) => option.value === value);
	});

	const handleChange = (event: Event) => {
		const target = event.target as HTMLSelectElement;
		const selectedValue = target.value;
		if (onInput) {
			onInput(selectedValue);
		}
	};
</script>

<select
	bind:value
	on:change={handleChange}
	aria-label="Select an option"
	aria-selected={selectedOption ? 'true' : 'false'}
	style="select"
>
	{#each options as option, i}
		<option value={option.value} selected={option.value === selectedOption?.value}>
			{option.label}
		</option>
	{/each}
</select>
