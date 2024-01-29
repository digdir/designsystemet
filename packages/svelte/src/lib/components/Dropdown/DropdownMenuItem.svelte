<script lang="ts">
  import { getContext } from 'svelte';

  /**
   * The link to be navigated to.
   * @default ''
   * @type {string}
   */
  export let href = '';
  /**
   * Target of the link.
   * @default '_blank'
   * @type {'_blank' | '_self' | '_parent' | '_top'}
   */
  export let target = '_blank';
  /**
   * Icon to be displayed in the dropdown menu item.
   * @default null
   */
  export let icon = null;

  export let onClick = (e) => {};

  let parentProps = getContext('parentProps');
  let size = parentProps?.size || 'medium';
</script>

<li class="dropdown-menu-item">
  <a
    {href}
    {target}
    class={size}
    on:click={(e) => {
      e.preventDefault();
      onClick(e);
      if (href) {
        window.open(href, target);
      }
    }}
  >
    {#if icon}
      {@html icon}
    {/if}
    <slot />
  </a>
</li>

<style lang="scss">
  a {
    cursor: pointer;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: var(--fds-spacing-2, 0.5625rem) var(--fds-spacing-4, 1.125rem);
    gap: var(--fds-sizing-2);
    color: var(--fds-semantic-text-neutral-default, #1b1b1b);
    border-radius: 0.25rem;
    &:hover {
      background: var(
        --fds-semantic-surface-action-first-no_fill-hover,
        #c8cbdc
      );
    }
    &:active {
      background: var(
        --fds-semantic-surface-action-first-no_fill-active,
        #7f86a7
      );
    }
  }
  .small {
    padding: var(--fds-spacing-2, 0.5625rem) var(--fds-spacing-3, 0.84375rem);
    /* typography/paragraph/short/small */
    font-family: inherit;
    font-size: 0.9375rem;
    font-style: normal;
    font-weight: 400;
    line-height: 130%; /* 1.21875rem */
  }
  .medium {
    padding: var(--fds-spacing-2, 0.5625rem) var(--fds-spacing-4, 1.125rem);
    /* typography/paragraph/short/medium */
    font-family: inherit;
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 400;
    line-height: 130%; /* 1.4625rem */
  }
  .large {
    padding: var(--fds-spacing-3, 0.84375rem) var(--fds-spacing-5, 1.40625rem);
    /* typography/paragraph/short/medium */
    font-family: inherit;
    font-size: 1.3125rem;
    font-style: normal;
    font-weight: 400;
    line-height: 130%; /* 1.4625rem */
  }
</style>
