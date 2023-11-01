<script>
  import { writable } from 'svelte/store';
  import { offset, flip, shift } from 'svelte-floating-ui/dom';
  import { arrow, createFloatingActions } from 'svelte-floating-ui';

  /**
   * Content of the tooltip.
   * @type {string}
   */
  export let content;

  /**
   * Placement of the tooltip on the trigger.
   * @type {'top' | 'right' | 'bottom' | 'left'}
   */
  export let placement = 'top';

  /**
   * Delay in milliseconds before opening.
   * @type {number}
   */
  export let delay = 150;

  /**
   * Whether the tooltip is open or not.
   * This overrides the internal state of the tooltip.
   * @type {boolean}
   */
  export let open = false;

  /**
   * Whether the tooltip is open by default or not.
   * @type {boolean}
   */
  export let defaultOpen = false;

  $: internalOpen = open ?? defaultOpen;
  const ARROW_HEIGHT = 7;
  const ARROW_GAP = 4;

  const arrowRef = writable(null);
  const [floatingRef, floatingContent] = createFloatingActions({
    strategy: 'absolute',
    placement: placement,
    middleware: [
      offset(ARROW_HEIGHT + ARROW_GAP),
      flip({
        fallbackAxisSideDirection: 'start',
      }),
      shift(),
      arrow({ element: arrowRef }),
    ],
    onComputed({ placement, middlewareData }) {
      const { x, y } = middlewareData.arrow;
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.split('-')[0]];

      Object.assign($arrowRef.style, {
        left: x != null ? `${x - 0}px` : '',
        top: y != null ? `${y - 0}px` : '',
        [staticSide]: '-4px',
      });
    },
  });
</script>

<div
  role="tooltip"
  class="tooltip-wrapper"
  on:mouseenter={async () => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    internalOpen = true;
  }}
  on:mouseleave={async () => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    internalOpen = false;
  }}
  use:floatingRef
>
  <slot />
</div>

{#if internalOpen}
  <div
    class="tooltip"
    use:floatingContent
    {...$$restProps}
  >
    {content}
    <div
      class="tooltip-arrow"
      style="height: {ARROW_HEIGHT}px"
      bind:this={$arrowRef}
    />
  </div>
{/if}

<style>
  .tooltip-wrapper {
    width: max-content;
    display: inline-block;
  }
  .tooltip {
    position: absolute;
    top: 0;
    left: 0;
    background: var(--fds-semantic-border-neutral-strong);
    color: white;
    padding: var(--fds-spacing-1) var(--fds-spacing-2);
    border-radius: var(--fds-border_radius-medium);
    font: var(--fds-typography-paragraph-xsmall);
  }
  .tooltip-arrow {
    position: absolute;
    background-color: var(--fds-semantic-border-neutral-strong);
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
  }
</style>
