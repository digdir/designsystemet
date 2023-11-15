<script>
  /**
   * `Button` used for interaction.
   * @prop {any} icon - Icon to be rendered in the button. This SVG object needs to be passed to the component as a named slot called "icon".
   */

  /**
   * Specify which variant to use. Options are 'filled', 'outline', 'quiet'.
   * @type {'filled' | 'outline' | 'quiet'}
   */
  export let variant = 'filled';

  /**
   * Specify which color palette to use. Options are 'first', 'second', 'success', 'danger', 'inverted'.
   * @type {'first' | 'second' | 'success' | 'danger' | 'inverted'}
   */
  export let color = 'first';

  /**
   * Size of the button. Options are 'small', 'medium', 'large'.
   * @type {'small' | 'medium' | 'large'}
   */
  export let size = 'medium';

  /**
   * If `Button` should fill full width of its container.
   */
  export let fullWidth = false;

  /**
   * Enable dashed border for `outline` variant.
   */
  export let dashedBorder = false;

  /**
   * Icon position inside Button. Options are 'right' or 'left'.
   * @type {'right' | 'left'}
   */
  export let iconPlacement = 'left';

  const computedClass = `button ${size} ${variant} ${color} ${
    fullWidth ? 'full-width' : ''
  } ${dashedBorder ? 'dashed-border' : ''} ${
    $$slots.icon !== undefined ? 'only-icon' : ''
  } ${$$props.class || ''}`;
</script>

<button
  on:click
  class={computedClass}
  {...$$restProps}
>
  {#if iconPlacement === 'left'}
    <slot name="icon" />
  {/if}
  <slot />
  {#if iconPlacement === 'right'}
    <slot name="icon" />
  {/if}
</button>

<style>
  .button {
    --fdsc-border-radius: var(--fds-border_radius-interactive);
    --fdsc-button-size: var(--fds-component-mode-height-small);
    --fdsc-button-padding: var(--fds-spacing-1) var(--fds-spacing-2);
    --fdsc-font-and-icon-color: var(--fds-semantic-text-action-first-on_action);
    --fdsc-icon-size: var(--fds-sizing-4);

    display: flex;
    align-items: center;
    border-radius: var(--fdsc-border-radius);
    border: var(--fds-border_width-default) solid transparent;
    color: var(--fdsc-font-and-icon-color);
    fill: var(--fdsc-font-and-icon-color);
    height: var(--fdsc-button-size);
    padding: var(--fdsc-button-padding);
    box-sizing: border-box;
    cursor: pointer;
    font-family: inherit;
    justify-content: center;
    text-align: center;
    letter-spacing: var(--typography-default-letter-spacing);
    text-decoration: none;
    position: relative;
  }

  .button svg {
    overflow: visible;
  }

  .button.small::before {
    position: absolute;
    top: 0;
    left: 0;
    width: auto;
    min-height: auto;
    content: '';
  }

  .button.small::after {
    position: absolute;
    top: -5px;
    left: 0;
    width: 100%;
    height: 44px;
    content: '';
  }

  .button:disabled,
  .button[aria-disabled='true'] {
    cursor: auto;
    opacity: var(--fds-opacity-disabled);
  }

  .icon {
    display: inline-block;
    height: var(--fdsc-icon-size);
    width: var(--fdsc-icon-size);
  }

  .button.small {
    --fdsc-button-size: var(--fds-component-mode-height-small);
    --fdsc-button-padding: var(--fds-spacing-1) var(--fds-spacing-2);
    --fdsc-icon-size: var(--fds-sizing-4);

    gap: var(--fds-sizing-2);
    min-width: var(--fdsc-button-size);
    font: var(--fds-typography-paragraph-small);
    font-family: inherit;
  }

  .button.medium {
    --fdsc-button-size: var(--fds-component-mode-height-medium);
    --fdsc-button-padding: var(--fds-spacing-2) var(--fds-spacing-3);
    --fdsc-icon-size: var(--fds-sizing-6);

    gap: var(--fds-sizing-3);
    min-width: var(--fdsc-button-size);
    font: var(--fds-typography-paragraph-medium);
    font-family: inherit;
  }

  .button.large {
    --fdsc-button-size: var(--fds-component-mode-height-large);
    --fdsc-button-padding: var(--fds-spacing-2) var(--fds-spacing-3);
    --fdsc-icon-size: var(--fds-sizing-8);

    gap: var(--fds-sizing-3);
    min-width: var(--fdsc-button-size);
    font: var(--fds-typography-paragraph-large);
    font-family: inherit;
  }

  .button.fullWidth {
    width: 100%;
  }

  .button.dashedBorder {
    border-style: dashed;
  }

  .button.outline {
    background-color: transparent;
  }

  .button.quiet {
    padding: 0 var(--fds-spacing-2);
    background-color: transparent;
  }

  .button.onlyIcon {
    padding: calc(
      (var(--fdsc-button-size) - var(--fdsc-icon-size)) / 2 -
        var(--fds-border_width-default)
    );
  }

  /* Only use hover for non-touch devices to prevent sticky-hovering */
  @media (hover: hover) and (pointer: fine) {
    .button.filled.first:not([aria-disabled='true'], :disabled):hover {
      background: var(--fds-semantic-surface-action-first-hover);
    }

    .button.filled.second:not([aria-disabled='true'], :disabled):hover {
      /* Hard coded color due to rgba issue, https://github.com/digdir/designsystem/issues/604 */
      background: #1a466d;
    }

    .button.filled.success:not([aria-disabled='true'], :disabled):hover {
      background: var(--fds-semantic-surface-success-hover);
    }

    .button.filled.danger:not([aria-disabled='true'], :disabled):hover {
      background: var(--fds-semantic-surface-danger-hover);
    }

    .button.filled.inverted:not([aria-disabled='true'], :disabled):hover {
      --fdsc-font-and-icon-color: var(--fds-semantic-text-neutral-default);

      background: var(--fds-semantic-surface-on_inverted-hover);
    }

    .button.outline.first:not([aria-disabled='true'], :disabled):hover {
      --fdsc-font-and-icon-color: var(--fds-semantic-text-action-first-hover);

      border-color: var(--fds-semantic-border-action-first-hover);
      background: var(--fds-semantic-surface-action-first-no_fill-hover);
    }

    .button.outline.second:not([aria-disabled='true'], :disabled):hover {
      border-color: var(--fds-semantic-border-action-second-hover);

      /* Hard coded color due to rgba issue, https://github.com/digdir/designsystem/issues/604 */
      background: #e5eaef;
    }

    .button.outline.success:not([aria-disabled='true'], :disabled):hover {
      --fdsc-font-and-icon-color: var(--fds-semantic-text-success-hover);

      border-color: var(--fds-semantic-border-success-hover);
      background: var(--fds-semantic-surface-success-no_fill-hover);
    }

    .button.outline.danger:not([aria-disabled='true'], :disabled):hover {
      --fdsc-font-and-icon-color: var(--fds-semantic-text-danger-hover);

      border-color: var(--fds-semantic-border-danger-hover);
      background: var(--fds-semantic-surface-danger-no_fill-hover);
    }

    .button.outline.inverted:not([aria-disabled='true'], :disabled):hover {
      background: var(--fds-semantic-surface-on_inverted-no_fill-hover);
    }

    .button.quiet.first:not([aria-disabled='true'], :disabled):hover {
      --fdsc-font-and-icon-color: var(--fds-semantic-text-action-first-hover);

      background: var(--fds-semantic-surface-action-first-no_fill-hover);
    }

    .button.quiet.second:not([aria-disabled='true'], :disabled):hover {
      /* Hard coded color due to rgba issue, https://github.com/digdir/designsystem/issues/604 */
      background: #e5eaef;
    }

    .button.quiet.success:not([aria-disabled='true'], :disabled):hover {
      --fdsc-font-and-icon-color: var(--fds-semantic-text-success-hover);

      background: var(--fds-semantic-surface-success-no_fill-hover);
    }

    .button.quiet.danger:not([aria-disabled='true'], :disabled):hover {
      --fdsc-font-and-icon-color: var(--fds-semantic-text-danger-hover);

      background: var(--fds-semantic-surface-danger-no_fill-hover);
    }

    .button.quiet.inverted:not([aria-disabled='true'], :disabled):hover {
      --fdsc-font-and-icon-color: var(--fds-semantic-text-neutral-on_inverted);

      background: var(--fds-semantic-surface-on_inverted-no_fill-hover);
    }
  }

  /* Filled button colors */
  .button.filled.first {
    background: var(--fds-semantic-surface-action-first-default);
  }

  .button.filled.first:not([aria-disabled='true'], :disabled):active {
    background: var(--fds-semantic-surface-action-first-active);
  }

  .button.filled.second {
    background: var(--fds-semantic-surface-action-second-default);
  }

  .button.filled.second:not([aria-disabled='true'], :disabled):active {
    /* Hard coded color due to rgba issue, https://github.com/digdir/designsystem/issues/604 */
    background: #335a7d;
  }

  .button.filled.success {
    background: var(--fds-semantic-surface-success-default);
  }

  .button.filled.success:not([aria-disabled='true'], :disabled):active {
    background: var(--fds-semantic-surface-success-active);
  }

  .button.filled.danger {
    background: var(--fds-semantic-surface-danger-default);
  }

  .button.filled.danger:not([aria-disabled='true'], :disabled):active {
    background: var(--fds-semantic-surface-danger-active);
  }

  .button.filled.inverted {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-neutral-default);

    background: var(--fds-semantic-surface-on_inverted-default);
  }

  .button.filled.inverted:not([aria-disabled='true'], :disabled):active {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-neutral-default);

    background: var(--fds-semantic-surface-on_inverted-active);
  }

  /* Outline button colors */
  .button.outline.first {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-action-first-default);

    border-color: var(--fds-semantic-border-action-first-default);
    background: var(--fds-semantic-surface-action-first-no_fill);
  }

  .button.outline.first:not([aria-disabled='true'], :disabled):active {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-action-first-active);

    border-color: var(--fds-semantic-border-action-first-active);
    background: var(--fds-semantic-surface-action-first-no_fill-active);
  }

  .button.outline.second {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-action-second-default);

    border-color: var(--fds-semantic-border-action-second-default);
    background: var(--fds-semantic-surface-action-second-no_fill);
  }

  .button.outline.second:not([aria-disabled='true'], :disabled):active {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-action-second-active);

    border-color: var(--fds-semantic-border-action-second-active);

    /* Hard coded color due to rgba issue, https://github.com/digdir/designsystem/issues/604 */
    background: #ccd6df;
  }

  .button.outline.success {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-success-default);

    border-color: var(--fds-semantic-border-success-default);
    background: var(--fds-semantic-surface-success-no_fill);
  }

  .button.outline.success:not([aria-disabled='true'], :disabled):active {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-success-active);

    border-color: var(--fds-semantic-border-success-active);
    background: var(--fds-semantic-surface-success-no_fill-active);
  }

  .button.outline.danger {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-danger-default);

    border-color: var(--fds-semantic-border-danger-default);
    background: var(--fds-semantic-surface-danger-no_fill);
  }

  .button.outline.danger:not([aria-disabled='true'], :disabled):active {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-danger-active);

    border-color: var(--fds-semantic-border-danger-active);
    background: var(--fds-semantic-surface-danger-no_fill-active);
  }

  .button.outline.inverted {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-neutral-on_inverted);

    border: 1px solid var(--fds-semantic-border-on_inverted-default);
    background: transparent;
  }

  .button.outline.inverted:not([aria-disabled='true'], :disabled):active {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-neutral-on_inverted);

    background: var(--fds-semantic-surface-on_inverted-no_fill-active);
  }

  /* Quiet button colors */
  .button.quiet.first {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-action-first-default);
  }

  .button.quiet.first:not([aria-disabled='true'], :disabled):active {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-action-first-active);

    background: var(--fds-semantic-surface-action-first-no_fill-active);
  }

  .button.quiet.second {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-action-second-default);
  }

  .button.quiet.second:not([aria-disabled='true'], :disabled):active {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-action-second-active);

    /* Hard coded color due to rgba issue, https://github.com/digdir/designsystem/issues/604 */
    background: #ccd6df;
  }

  .button.quiet.success {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-success-default);
  }

  .button.quiet.success:not([aria-disabled='true'], :disabled):active {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-success-active);

    background: var(--fds-semantic-surface-success-no_fill-active);
  }

  .button.quiet.danger {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-danger-default);
  }

  .button.quiet.danger:not([aria-disabled='true'], :disabled):active {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-danger-active);

    background: var(--fds-semantic-surface-danger-no_fill-active);
  }

  .button.quiet.inverted {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-neutral-on_inverted);

    background: transparent;
  }

  .button.quiet.inverted:not([aria-disabled='true'], :disabled):active {
    --fdsc-font-and-icon-color: var(--fds-semantic-text-neutral-on_inverted);

    background: var(--fds-semantic-surface-on_inverted-no_fill-active);
  }
</style>
