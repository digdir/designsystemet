<script>
  /**
   * Use `Paragraph` to display text with paragraph text styles.
   * @prop {string} [as='p'] - The type of element to render. Default is 'p'.
   * @prop {string} [size='medium'] - Changes text sizing. Options are 'xsmall', 'small', 'medium', or 'large'.
   * @prop {boolean} [spacing=false] - Adds margin-bottom.
   * @prop {boolean} [short=false] - Reduces line-height for short paragraphs.
   * @prop {string} [class=''] - Additional classes to add to the component.
   */
  export let as = 'p';
  export let size = 'medium';
  export let spacing = false;
  export let short = false;

  $: computedClass = [
    'paragraph',
    size,
    spacing ? 'spacing' : '',
    short ? 'short' : '',
    $$props.class || '',
  ]
    .filter(Boolean)
    .join(' ');
</script>

{#if as === 'p'}
  <p class={computedClass}>
    <slot />
  </p>
{:else if as === 'span'}
  <span class={computedClass}>
    <slot />
  </span>
{:else}
  <div class={computedClass}>
    <slot />
  </div>
{/if}

<style>
  :global(.paragraph) {
    --fdsc-typography-font-family: inherit;
    --fdsc-bottom-spacing: var(--fds-spacing-5);

    color: var(--fds-semantic-text-neutral-default);
    margin: 0;
  }

  .paragraph.spacing {
    margin-bottom: var(--fdsc-bottom-spacing);
  }

  .paragraph.large {
    --fdsc-bottom-spacing: var(--fds-spacing-6);

    font: var(--fds-typography-paragraph-large);
    font-family: var(--fdsc-typography-font-family);
  }

  .paragraph.large.short {
    font: var(--fds-typography-paragraph-short-large);
    font-family: var(--fdsc-typography-font-family);
  }

  .paragraph.medium {
    --fdsc-bottom-spacing: var(--fds-spacing-5);

    font: var(--fds-typography-paragraph-medium);
    font-family: var(--fdsc-typography-font-family);
  }

  .paragraph.medium.short {
    --fdsc-bottom-spacing: var(--fds-spacing-5);

    font: var(--fds-typography-paragraph-short-medium);
    font-family: var(--fdsc-typography-font-family);
  }

  .paragraph.small {
    --fdsc-bottom-spacing: var(--fds-spacing-4);

    font: var(--fds-typography-paragraph-small);
    font-family: var(--fdsc-typography-font-family);
  }

  .paragraph.small.short {
    --fdsc-bottom-spacing: var(--fds-spacing-4);

    font: var(--fds-typography-paragraph-short-small);
    font-family: var(--fdsc-typography-font-family);
  }

  .paragraph.xsmall {
    --fdsc-bottom-spacing: var(--fds-spacing-3);

    font: var(--fds-typography-paragraph-xsmall);
    font-family: var(--fdsc-typography-font-family);
  }

  .paragraph.xsmall.short {
    --fdsc-bottom-spacing: var(--fds-spacing-3);

    font: var(--fds-typography-paragraph-short-xsmall);
    font-family: var(--fdsc-typography-font-family);
  }
</style>
