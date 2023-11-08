<script>
  /**
   * Sets the title of the spinner for accessibility purposes.
   * @type {string}
   */
  export let title = '';

  /**
   * The size of the spinner to render. Options are 'xSmall', 'small', 'medium', 'large', '1xLarge', '2xLarge', '3xLarge'. Defaults to 'medium'.
   * @type {'xSmall' | 'small' | 'medium' | 'large' | 'xLarge'}
   */
  export let size = 'medium';

  /**
   * What variant of the spinner to render. Options are 'default', 'interaction', 'inverted'. Defaults to 'default'.
   * @type {'default' | 'interaction' | 'inverted'}
   */
  export let variant = 'default';
  export let className = '';

  const sizeMap = {
    xSmall: 15,
    small: 23,
    medium: 51,
    large: 67,
    xLarge: 101,
  };

  const strokeWidthMap = {
    xSmall: 5,
    small: 4.5,
    medium: 5,
    large: 4.2,
    xLarge: 4.5,
  };

  const variantMap = {
    default: {
      foreground: 'defaultForeground',
      background: 'defaultBackground',
    },
    interaction: {
      foreground: 'interactionForeground',
      background: 'interactionBackground',
    },
    inverted: {
      foreground: 'invertedForeground',
      background: 'invertedBackground',
    },
  };

  const styles = {
    width: `${sizeMap[size]}px`,
    height: `${sizeMap[size]}px`,
  };
</script>

<svg
  class="spinner {className}"
  viewBox="0 0 50 50"
  width={styles.width}
  height={styles.height}
  {...$$restProps}
>
  <title>{title}</title>
  <circle
    class={variantMap[variant].background}
    cx="25"
    cy="25"
    r="20"
    stroke-width={strokeWidthMap[size]}
    fill="none"
  />
  <circle
    class="spinnerCircle {variantMap[variant].foreground}"
    cx="25"
    cy="25"
    r="20"
    stroke-width={strokeWidthMap[size]}
    fill="none"
  />
</svg>

<style lang="scss">
  .spinner {
    animation: rotate-animation 1s linear infinite;
  }

  .spinnerCircle {
    animation: stroke-animation 1.5s ease-in-out infinite;
  }

  .defaultForeground {
    stroke: var(--colors-grey-500, #a5aab1);
  }

  .interactionForeground {
    stroke: var(--fds-semantic-border-action-first-default, #0062ba);
  }

  .invertedForeground {
    stroke: var(--colors-white, #ffffff);
  }

  .defaultBackground,
  .interactionBackground,
  .invertedBackground {
    stroke: var(--colors-grey-200, #e9eaec);
  }

  @keyframes rotate-animation {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes stroke-animation {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -62;
    }

    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
</style>
