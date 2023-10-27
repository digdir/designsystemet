<script>
/**
   * The type of element to render. Options are 'a' or 'button'.
   * @type {'a' | 'button'}
   */
   export let as = 'a';
  
  /**
   * Inverts the color of the link. Use this on dark backgrounds.
   * @type {boolean}
   */
  export let inverted = false;
  
  /**
   * The URL the link points to. Only used if `as` is 'a'.
   * @type {string}
   */
  export let href = '';

  $: computedClass = `link ${inverted ? 'inverted' : ''} ${
    $$props.class || ''
  }`;
</script>

{#if as === 'a'}
  <a
    class={computedClass}
    {href}
    {...$$restProps}
  >
    <slot />
  </a>
{:else if as === 'button'}
  <button class={computedClass} {...$$restProps}>
    <slot />
  </button>
{/if}

<style lang="scss">
  .link {
    --fdsc-link-hover-underline-color: var(
      --fds-semantic-text-action-primary-default
    );

    color: var(--fds-semantic-text-action-primary-default);
    cursor: pointer;
    text-decoration: underline;
    text-decoration-thickness: max(1px, 0.0625rem);
    text-underline-offset: max(4px, 0.25rem);
    display: inline-flex;
    align-items: center;
    gap: var(--fds-spacing-1);
  }

  .link:visited {
    color: var(--fds-semantic-text-visited-default);
    text-decoration: none;
  }

  .link:hover {
    color: var(--fds-semantic-text-action-primary-default);
    text-decoration-thickness: max(2px, 0.125rem, 0.12em);
  }

  .link:active,
  .link:focus {
    background: var(--fds-semantic-border-focus-outline);
    box-shadow: 0 max(3px, 0.1875rem, 0.18em)
      var(--fds-semantic-border-focus-boxshadow);
    color: var(--fds-semantic-text-action-primary-active);
    outline: none;
    text-decoration: none;
  }

  .link.inverted:not(:focus, :active),
  .link.inverted:not(:focus, :active):hover,
  .link.inverted:not(:focus, :active):visited {
    --fdsc-link-hover-underline-color: white;

    color: white;
  }
</style>
