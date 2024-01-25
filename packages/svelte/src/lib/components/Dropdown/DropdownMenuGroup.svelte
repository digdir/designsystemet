<script lang="ts">
  import { getContext } from 'svelte';

  /**
   * Text to be displayed in the dropdown menu group.
   */
  export let label = '';

  let parentProps = getContext('parentProps');
  let size = parentProps?.size || 'medium';
</script>

<li>
  <ul class="dropdown-menu-group">
    {#if label}
      <li class="dropdown-menu-group-label {size}">{label}</li>
    {/if}
    <slot />
  </ul>
</li>

<style>
  li {
    width: 100%;
  }
  .dropdown-menu-group-label {
    display: flex;

    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;

    color: var(--fds-semantic-text-neutral-subtle, #4b5563);
  }
  .dropdown-menu-group {
    width: 100%;
    list-style: none;
    padding-inline-start: 0;
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
