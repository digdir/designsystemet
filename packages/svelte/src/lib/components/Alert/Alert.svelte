<script>
  import Paragraph from '../Typography/Paragraph/Paragraph.svelte';

  /**
   * Alert component to show notifications with varying severity. Options are 'info', 'warning', 'success', or 'danger'.
   * @type { 'info' | 'warning' | 'success' | 'danger'}
   */
  export let severity = 'info';

  /**
   * Adds a shadow to elevate the component.
   * @type {boolean}
   */
  export let elevated = false;
</script>

<div
  class={`alert ${severity} ${elevated ? 'elevated' : ''}`}
  {...$$restProps}
>
  <div class="icon">
    {#if severity == 'danger'}
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        role="img"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.742 2.47a.75.75 0 0 1 .53-.22h7.456a.75.75 0 0 1 .53.22l5.272 5.272c.141.14.22.331.22.53v7.456a.75.75 0 0 1-.22.53l-5.272 5.272a.75.75 0 0 1-.53.22H8.272a.75.75 0 0 1-.53-.22L2.47 16.258a.75.75 0 0 1-.22-.53V8.272a.75.75 0 0 1 .22-.53L7.742 2.47Zm1.288 5.5a.75.75 0 0 0-1.06 1.06L10.94 12l-2.97 2.97a.75.75 0 1 0 1.06 1.06L12 13.06l2.97 2.97a.75.75 0 1 0 1.06-1.06L13.06 12l2.97-2.97a.75.75 0 0 0-1.06-1.06L12 10.94 9.03 7.97Z"
          fill="currentColor"
        />
      </svg>
    {:else if severity == 'warning'}
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        role="img"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12 2.25a.75.75 0 0 1 .656.387l9.527 17.25A.75.75 0 0 1 21.526 21H2.474a.75.75 0 0 1-.657-1.113l9.526-17.25A.75.75 0 0 1 12 2.25ZM12 8.75a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 .75-.75Zm-1 7.75a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
          fill="currentColor"
        />
      </svg>
    {:else if severity == 'info'}
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        role="img"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3.25 4A.75.75 0 0 1 4 3.25h16a.75.75 0 0 1 .75.75v16a.75.75 0 0 1-.75.75H4a.75.75 0 0 1-.75-.75V4ZM11 7.75a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm-1.25 3a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 .75.75v4.75h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75v-4h-.75a.75.75 0 0 1-.75-.75Z"
          fill="currentColor"
        />
      </svg>
    {:else if severity == 'success'}
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        role="img"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12 21.75c5.385 0 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25 2.25 6.615 2.25 12s4.365 9.75 9.75 9.75Zm4.954-12.475a.813.813 0 0 0-1.24-1.05l-5.389 6.368L7.7 11.967a.812.812 0 0 0-1.15 1.15l3.25 3.25a.812.812 0 0 0 1.195-.05l5.959-7.042Z"
          fill="currentColor"
        />
      </svg>
    {/if}
  </div>
  <Paragraph
    as="span"
    className="content"
  >
    <slot />
  </Paragraph>
</div>

<style>
  .alert {
    --fdsc-alert-border: var(--fds-semantic-border-info-default);
    --fdsc-alert-icon-color: var(--fdsc-alert-border);
    --fdsc-alert-background: var(--fds-semantic-surface-info-subtle);
    --fdsc-alert-color: var(--fds-semantic-text-neutral-default);
    --fdsc-alert-box-shadow-left: 8px 0 0 0 var(--fdsc-alert-border) inset;

    box-shadow: var(--fdsc-alert-box-shadow-left);
    background: var(--fdsc-alert-background);
    color: var(--fdsc-alert-color);
    padding: var(--fds-spacing-4);
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: min-content auto;
    gap: var(--fds-spacing-2);
  }

  .icon {
    --icon-size: calc(
      (4 * 6 / 16) * var(--fds-font-size-f0)
    ); /** Fluid sizing-6 */

    height: var(--icon-size);
    width: var(--icon-size);
    color: var(--fdsc-alert-icon-color);
    scale: 1.5;
    & > svg {
      margin: 5px;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
  }

  .info {
    --fdsc-alert-border: var(--fds-semantic-border-info-default);
    --fdsc-alert-background: var(--fds-semantic-surface-info-subtle);
  }

  .warning {
    --fdsc-alert-border: var(--fds-semantic-border-warning-default);
    --fdsc-alert-background: var(--fds-semantic-surface-warning-subtle);
  }

  .success {
    --fdsc-alert-border: var(--fds-semantic-border-success-default);
    --fdsc-alert-background: var(--fds-semantic-surface-success-subtle);
  }

  .danger {
    --fdsc-alert-border: var(--fds-semantic-border-danger-default);
    --fdsc-alert-background: var(--fds-semantic-surface-danger-subtle);
  }

  .elevated {
    box-shadow: var(--fdsc-alert-box-shadow-left), var(--fds-shadow-small);
  }
</style>
