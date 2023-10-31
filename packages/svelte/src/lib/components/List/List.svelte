<script>
  /**
   * List component to render an unordered list with customizable border styles between items.
   * @prop {string} [as='ul'] - The HTML element to render the component as. Options are 'ul', 'ol', 'none'.
   */
  export let as = 'ul';
</script>

{#if as === 'ul'}
  <ul>
    <slot />
  </ul>
{/if}

{#if as === 'ol'}
  <ol>
    <slot />
  </ol>
{/if}

{#if as === 'none'}
  <ul class="list none">
    <slot />
  </ul>
{/if}

<style>
  .list.none {
    list-style-type: none;
  }
</style>
