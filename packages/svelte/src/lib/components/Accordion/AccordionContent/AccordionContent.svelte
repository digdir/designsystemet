<script>
  import { getContext } from 'svelte';
  import { slide } from 'svelte/transition';

  let open = null;

  $: {
    try {
      open = getContext('accordionItem').open;
    } catch {
      console.error(
        '<AccordionContent> has to be used within an <AccordionItem>',
      );
    }
  }
</script>

{#if $open}
  <div
    class="content"
    transition:slide|local
  >
    {#if $$slots.content}
      <slot name="content" />
    {/if}
  </div>
{/if}

<style>
  .content {
    padding: var(--fds-spacing-5, 1rem);
    background-color: #ffffff50;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
