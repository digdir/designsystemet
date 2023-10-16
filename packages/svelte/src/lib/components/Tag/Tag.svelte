<script>
  import Paragraph from '../Typography/Paragraph/Paragraph.svelte';

  /**
   * `Tag` component for labeling or categorizing.
   * @prop {string} [color='neutral'] - Color of the tag. Options are 'first', 'second', 'third', 'neutral', 'success', 'warning', 'danger', 'info'.
   * @prop {string} [size='medium'] - Size of the tag. Options are 'xsmall', 'small', 'medium'.
   * @prop {string} [variant='filled'] - Variant of the tag. Options are 'filled', 'outlined'.
   * @prop {string} [class=''] - Additional classes to add to the component.
   */
  export let color = 'neutral';
  export let size = 'medium';
  export let variant = 'filled';
</script>

<span
  class={`paragraph ${size} tag ${color}  ${variant} ${$$props.class || ''}`}
>
  <slot />
</span>

<style lang="scss">
  .paragraph {
    --fdsc-typography-font-family: inherit;
    --fdsc-bottom-spacing: var(--fds-spacing-5);
    color: var(--fds-semantic-text-neutral-default);
    margin: 0;

    &.large {
      --fdsc-bottom-spacing: var(--fds-spacing-6);
      font: var(--fds-typography-paragraph-large);
      font-family: var(--fdsc-typography-font-family);
    }

    &.medium {
      --fdsc-bottom-spacing: var(--fds-spacing-5);
      font: var(--fds-typography-paragraph-medium);
      font-family: var(--fdsc-typography-font-family);
    }

    &.small {
      --fdsc-bottom-spacing: var(--fds-spacing-4);
      font: var(--fds-typography-paragraph-small);
      font-family: var(--fdsc-typography-font-family);
    }

    &.xsmall {
      --fdsc-bottom-spacing: var(--fds-spacing-3);
      font: var(--fds-typography-paragraph-xsmall);
      font-family: var(--fdsc-typography-font-family);
    }
  }

  .tag {
    --fdsc-tag-border: var(--fds-semantic-border-neutral-default);
    --fdsc-tag-background: var(--fds-semantic-surface-neutral-subtle);
    --fdsc-tag-text: var(--fds-semantic-text-neutral-default);
    --fdsc-tag-padding: var(--fds-spacing-2);
    --fdsc-tag-min-height: var(--fds-sizing-7);
    --fdsc-tag-border-radius: var(--fds-border_radius-small);
    color: var(--fdsc-tag-text);
    padding: 0 var(--fdsc-tag-padding);
    border: var(--fds-border_width-default) solid var(--fdsc-tag-border);
    background-color: var(--fdsc-tag-background);
    min-height: var(--fdsc-tag-min-height);
    border-radius: var(--fdsc-tag-border-radius);
    display: flex;
    align-items: center;
    box-sizing: border-box;
    word-break: break-word;
    width: max-content;

    &.xsmall {
      --fdsc-tag-padding: var(--fds-spacing-1);
      --fdsc-tag-min-height: var(--fds-sizing-5);
    }

    &.small {
      --fdsc-tag-padding: var(--fds-spacing-1);
      --fdsc-tag-min-height: var(--fds-sizing-6);
    }

    &.medium {
      --fdsc-tag-padding: var(--fds-spacing-2);
      --fdsc-tag-min-height: var(--fds-sizing-7);
    }

    &.outlined {
      &.neutral {
        --fdsc-tag-border: var(--fds-semantic-border-neutral-default);
        --fdsc-tag-background: var(--fds-semantic-surface-neutral-subtle);
        --fdsc-tag-text: var(--fds-semantic-text-neutral-default);
      }

      &.info {
        --fdsc-tag-border: var(--fds-semantic-border-info-default);
        --fdsc-tag-background: var(--fds-semantic-surface-info-subtle);
        --fdsc-tag-text: var(--fds-semantic-text-neutral-default);
      }

      &.success {
        --fdsc-tag-border: var(--fds-semantic-border-success-default);
        --fdsc-tag-background: var(--fds-semantic-surface-success-subtle);
        --fdsc-tag-text: var(--fds-semantic-text-success-on_success_subtle);
      }

      &.warning {
        --fdsc-tag-border: var(--fds-semantic-border-warning-default);
        --fdsc-tag-background: var(--fds-semantic-surface-warning-subtle);
        --fdsc-tag-text: var(--fds-semantic-text-neutral-default);
      }

      &.danger {
        --fdsc-tag-border: var(--fds-semantic-border-danger-default);
        --fdsc-tag-background: var(--fds-semantic-surface-danger-subtle);
        --fdsc-tag-text: var(--fds-semantic-text-danger-on_danger_subtle);
      }

      &.first {
        --fdsc-tag-border: var(--fds-semantic-surface-first-dark);
        --fdsc-tag-background: var(--fds-semantic-surface-first-light);
        --fdsc-tag-text: var(--fds-semantic-text-neutral-default);
      }

      &.second {
        --fdsc-tag-border: var(--fds-semantic-surface-second-dark);
        --fdsc-tag-background: var(--fds-semantic-surface-second-light);
        --fdsc-tag-text: var(--fds-semantic-text-neutral-default);
      }

      &.third {
        --fdsc-tag-border: var(--fds-semantic-surface-third-dark);
        --fdsc-tag-background: var(--fds-semantic-surface-third-light);
        --fdsc-tag-text: var(--fds-semantic-text-neutral-default);
      }
    }

    &.filled {
      &.neutral {
        --fdsc-tag-border: var(--fds-semantic-surface-neutral-dark);
        --fdsc-tag-background: var(--fds-semantic-surface-neutral-dark);
        --fdsc-tag-text: var(--fds-semantic-text-neutral-on_inverted);
      }

      &.info {
        --fdsc-tag-border: var(--fds-semantic-surface-info-subtle-hover);
        --fdsc-tag-background: var(--fds-semantic-surface-info-subtle-hover);
        --fdsc-tag-text: var(--fds-semantic-text-neutral-default);
      }

      &.success {
        --fdsc-tag-border: var(--fds-semantic-surface-success-default);
        --fdsc-tag-background: var(--fds-semantic-surface-success-default);
        --fdsc-tag-text: var(--fds-semantic-text-success-on_success);
      }

      &.warning {
        --fdsc-tag-border: var(--fds-semantic-surface-warning-default);
        --fdsc-tag-background: var(--fds-semantic-surface-warning-default);
        --fdsc-tag-text: var(--fds-semantic-text-neutral-default);
      }

      &.danger {
        --fdsc-tag-border: var(--fds-semantic-surface-danger-default);
        --fdsc-tag-background: var(--fds-semantic-surface-danger-default);
        --fdsc-tag-text: var(--fds-semantic-text-danger-on_danger);
      }

      &.first {
        --fdsc-tag-border: var(--fds-semantic-surface-first-dark);
        --fdsc-tag-background: var(--fds-semantic-surface-first-dark);
        --fdsc-tag-text: var(--fds-semantic-text-neutral-default);
      }

      &.second {
        --fdsc-tag-border: var(--fds-semantic-surface-second-dark);
        --fdsc-tag-background: var(--fds-semantic-surface-second-dark);
        --fdsc-tag-text: var(--fds-semantic-text-neutral-default);
      }

      &.third {
        --fdsc-tag-border: var(--fds-semantic-surface-third-dark);
        --fdsc-tag-background: var(--fds-semantic-surface-third-dark);
        --fdsc-tag-text: var(--fds-semantic-text-neutral-default);
      }
    }
  }
</style>
