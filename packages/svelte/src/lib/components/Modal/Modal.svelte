<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import Button from '$lib/components/Button/Button.svelte';

  export let show = false;
  export let title = 'Dette er en tittel';
  export let primaryButtonText = 'OK';
  export let secondaryButtonText = 'Avbryt';
  export let onClose = () => {};

  const dispatch = createEventDispatcher();

  function close() {
    onClose();
    dispatch('close');
  }

  function handleClick(event) {
    const modal = document.querySelector('.modal');

    if (modal && !modal.contains(event.target)) {
      close();
    }
  }

  onMount(() => {
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  });
</script>

{#if show}
  <div class="modal-background">
    <div class="modal">
      <div class="modal-header">
        <h2>{title}</h2>
        <button
          class="close-btn"
          on:click={close}>&times;</button
        >
      </div>
      <div class="modal-content">
        <slot />
      </div>
      <div class="modal-footer">
        <Button
          on:click={close}
          variant="outline">{secondaryButtonText}</Button
        >
        <div style="width: 8px;" />
        <Button>{primaryButtonText}</Button>
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
    padding: 24px;
    border: 1px;
    border-radius: 2px;
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
    font-size: 2em;
  }

  .modal-content {
    padding-bottom: 16px;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
</style>
