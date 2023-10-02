<script>
	import { createEventDispatcher } from 'svelte';

	export let show = false;
	export let title = '';

	const dispatch = createEventDispatcher();

	function close() {
		show = false;
		dispatch('close');
	}
</script>

{#if show}
	<div class="modal-background">
		<div class="modal">
			<div class="modal-header">
				<h2>{title}</h2>
				<button class="close-btn" on:click={close}>&times;</button>
			</div>
			<div class="modal-content">
				<slot />
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal {
		background: white;
		padding: 20px;
		border-radius: 8px;
		max-width: 500px;
		width: 80%;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.close-btn {
		cursor: pointer;
		border: none;
		background: none;
		font-size: 1.5em;
	}
</style>
