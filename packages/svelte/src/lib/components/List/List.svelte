<script>
  /**
   * List component to render a list.
   * @prop {string} [as='ul'] - The HTML element to render the component as. Options are 'ul', 'ol', 'none'. Defaults to 'ul'.
   * @type { 'ul' | 'ol' | 'none' }
   */
  export let as = 'ul';

  /**
   * Additional classes to add to the component.
   * @type {string}
   */
  export let className = '';
</script>

{#if as === 'ul'}
  <ul
    class="list {className}"
    {...$$restProps}
  >
    <slot />
  </ul>
{/if}

{#if as === 'ol'}
  <ol
    class="list {className}"
    {...$$restProps}
  >
    <slot />
  </ol>
{/if}

{#if as === 'none'}
  <ul
    class="list none {className}"
    {...$$restProps}
  >
    <slot class="none" />
  </ul>
{/if}

<style>
  .list {
    margin-block-start: 0;
    margin-block-end: 0;
  }
  .list.none {
    list-style-type: none;
    padding-inline-start: 0;
  }
</style>
