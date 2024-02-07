<script>
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
      <div class="icon {size}">
        {@html icon}
      </div>
    {:else}
      <div class="icon {size}" style="display:none;"><svg /></div>
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
    align-items: end;
    padding: var(--fds-spacing-2, 0.5625rem) var(--fds-spacing-4, 1.125rem);
    gap: var(--fds-sizing-2);
    color: var(--fds-semantic-text-action-first-default, '#00244E');
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
  a.small {
    padding: var(--fds-spacing-2, 0.5625rem) var(--fds-spacing-3, 0.84375rem);
    /* typography/paragraph/short/small */
    font-family: inherit;
    font-size: 0.9375rem;
    font-style: normal;
    font-weight: 400;
    line-height: 130%; /* 1.21875rem */
  }
  a.medium {
    padding: var(--fds-spacing-2, 0.5625rem) var(--fds-spacing-4, 1.125rem);
    /* typography/paragraph/short/medium */
    font-family: inherit;
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 400;
    line-height: 130%; /* 1.4625rem */
  }
  a.large {
    padding: var(--fds-spacing-3, 0.84375rem) var(--fds-spacing-5, 1.40625rem);
    /* typography/paragraph/short/medium */
    font-family: inherit;
    font-size: 1.3125rem;
    font-style: normal;
    font-weight: 400;
    line-height: 130%; /* 1.4625rem */
  }
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--fds-semantic-surface-action-default, '#00244E');
    height: 1.25rem;
    width: 1.25rem;
    &.small {
      height: var(--fds-sizing-4);
      width: var(--fds-sizing-4);
      & > svg {
        height: var(--fds-sizing-4);
        width: var(--fds-sizing-4);
      }
    }
    &.medium {
      height: var(--fds-sizing-6);
      width: var(--fds-sizing-6);
      & > svg {
        height: var(--fds-sizing-6);
        width: var(--fds-sizing-6);
      }
    }
    &.large {
      height: var(--fds-sizing-8);
      width: var(--fds-sizing-8);
      & > svg {
        height: var(--fds-sizing-8);
        width: var(--fds-sizing-8);
      }
    }
  }
</style>
