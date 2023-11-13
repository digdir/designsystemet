<script>
  import { createEventDispatcher, onMount } from 'svelte';

  /**
   * `Modal`.
   * @prop {string} [modalVariant = 'default'] - Specify which variant to use for the modal. Options are 'default', 'alert'.
   * @prop {string} [title = 'Dette er en tittel'] - Title of the modal.
   * @prop {string} [primaryButtonText = 'OK'] - Text on primary button.
   * @prop {string} [primaryButtonVariant='filled'] - Specify which variant to use for primary button. Options are 'filled', 'outline', 'quiet'.
   * @prop {string} [primaryButtonColor='first'] - Specify which color palette to use for primary button. Options are 'first', 'second', 'success', 'danger', 'inverted'.
   * @prop {string} [primaryButtonSize='medium'] - Size of the primary button. Options are 'small', 'medium', 'large'.
   * @prop {string} [secondaryButtonText = 'Avbryt'] - Text on secondary button.
   * @prop {string} [secondaryButtonVariant='outline'] - Specify which variant to use for secondary button. Options are 'filled', 'outline', 'quiet'.
   * @prop {string} [secondaryButtonColor='first'] - Specify which color palette to use for secondary button. Options are 'first', 'second', 'success', 'danger', 'inverted'.
   * @prop {string} [secondaryButtonSize='medium'] - Size of the secondary button. Options are 'small', 'medium', 'large'.
   * @prop {number} [numberOfErrors=0] - Number of errors.
   * @prop {boolean} [isModalValidating=false] - Whether the modal is validating.
   */

  export let modalVariant = 'default';
  export let title = 'Dette er en tittel';
  export let primaryButtonText = 'OK';
  export let primaryButtonVariant = 'filled';
  export let primaryButtonColor = modalVariant === 'alert' ? 'danger' : 'first';
  export let primaryButtonSize = 'medium';
  export let secondaryButtonText = 'Avbryt';
  export let secondaryButtonVariant = 'outline';
  export let secondaryButtonColor = 'first';
  export let secondaryButtonSize = 'medium';
  export let numberOfErrors = 0;
  export let isModalValidating = false;

  export let onClose = () => {};
  export let onPrimaryButtonClick = () => {};

  const dispatch = createEventDispatcher();

  let closeButton;
  let lastButton;

  function close() {
    onClose();
    dispatch('close');
  }

  function handleClick(event) {
    const modal = document.querySelector('.modal');

    if (modal && !modal.contains(event.target)) {
      close();
    }
  }

  function handleKeyDown(event) {
    if (
      event.key === 'Escape' ||
      event.key === 'Esc' ||
      event.key === 'escape' ||
      event.key === 'esc'
    ) {
      close();
    }
  }

  function handlePrimaryButtonClick() {
    onPrimaryButtonClick();
    dispatch('primaryButtonClick');
  }

  onMount(() => {
    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<div class="modal-background">
  <div class={`modal ${modalVariant}`}>
    <a
      href="/"
      on:focus={() => closeButton.focus()}><div /></a
    >
    <a
      href="/"
      on:focus={() => lastButton.focus()}><div /></a
    >
    <div class="modal-header">
      <h2 style="margin: 0;">{title}</h2>
      <button
        class="close-btn"
        on:click={close}
        bind:this={closeButton}>&times;</button
      >
    </div>
    <div class="modal-content">
      <slot />
    </div>
    <div class="modal-footer">
      <button
        class={`button ${primaryButtonSize} ${primaryButtonVariant} ${primaryButtonColor}`}
        on:click={handlePrimaryButtonClick}>{primaryButtonText}</button
      >
      <div style="width: 8px;" />
      <button
        class={`button ${secondaryButtonSize} ${secondaryButtonVariant} ${secondaryButtonColor}`}
        on:click={close}
        bind:this={lastButton}>{secondaryButtonText}</button
      >
    </div>
    {#if numberOfErrors > 0 && isModalValidating}
      <p class="error-text">
        {`${numberOfErrors} feil må rettes før du kan gå videre.`}
      </p>
    {/if}
    <a
      href="/"
      on:focus={() => closeButton.focus()}><div /></a
    >
  </div>
</div>

<style>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    display: inline-flex;
    padding: var(--component-mode-spacing-large, 18px);
    flex-direction: column;
    gap: 8px;
    max-width: 500px;
    width: 80%;
    border-radius: var(--border-radius-small, 2px);
    border: 1px solid var(--semantic-border-neutral-subtle, #d2d5d8);
    z-index: 1001;
  }

  .modal.default {
    background: var(--brand-alt-3100, #fff4e8);
    box-shadow: 6px 6px 0px -5px #f39200;
  }

  .modal.alert {
    background: var(--semantic-surface-neutral-default, #fff);
    box-shadow: 6px 6px 0px -5px #e02e49;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .close-btn {
    cursor: pointer;
    border: none;
    background: none;
    font-size: 2em;
  }

  .modal-content {
    padding-bottom: 16px;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

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

  .button.outline {
    background-color: transparent;
  }

  .button.quiet {
    padding: 0 var(--fds-spacing-2);
    background-color: transparent;
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
  .error-text {
    color: red;
    padding: 0;
    margin: 0;
  }
</style>
