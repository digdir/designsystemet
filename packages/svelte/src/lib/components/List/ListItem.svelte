<script>
  export let className = '';
</script>

<li
  class="listItem {className}"
  {...$$restProps}
>
  <slot />
</li>

<style>
  .listItem {
    border-bottom-color: var(--component-list-border_color);
    border-bottom-style: var(--component-list-border_style);
    border-bottom-width: var(--component-list-border_width);
    padding-left: var(--fds-spacing-1, 0.28125rem);
    margin-bottom: var(--fds-component-mode-gap-medium, 0.5625rem);
  }

  .listItem.no-padding {
    padding-left: 0;
  }
</style>
