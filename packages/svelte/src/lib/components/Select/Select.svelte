<script>
	import { createEventDispatcher } from 'svelte';

	export let options = [];
	export let value;

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('click');
	}

	function handleBlur() {
		dispatch('blur');
	}

	function handleChange(event) {
		value = (event.target).value;
		dispatch('change', value);
	}

	let selectedOption;
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
	class={$$props.class}
>
	{#each options as option (option.value)}
		<option value={option.value} selected={option.value === value}>
			{option.label}
		</option>
	{/each}
</select>

<style>
	.hidden-select-arrow {
		appearance: none;
		border: none;
		background-color: transparent;
		padding: 5px 35px 5px 5px;
		margin-left: 0.3rem;
	}
</style>
