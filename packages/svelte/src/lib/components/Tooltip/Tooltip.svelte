<script>
  import { writable } from 'svelte/store';
  import { offset, flip, shift } from 'svelte-floating-ui/dom';
  import { arrow, createFloatingActions } from 'svelte-floating-ui';

  const ARROW_HEIGHT = 7;

  /**
   * Placement of the tooltip on the trigger.
   * @type {'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end'}
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
  export let open = undefined;

  /**
   * Whether the tooltip is open by default or not.
   * @type {boolean}
   */
  export let defaultOpen = false;

  /**
   * Space between children and tooltip-arrow.
   * @type {number}
   */
  export let arrowGap = 4;

  /**
   * Whether to show the tooltip arrow or not.
   * @type {boolean}
   */
  export let showArrow = true;

  $: internalOpen = open ?? defaultOpen;

  const arrowRef = writable(null);
  const [floatingRef, floatingContent] = createFloatingActions({
    strategy: 'absolute',
    placement: placement,
    middleware: [
      offset(ARROW_HEIGHT + arrowGap),
      flip({
        fallbackAxisSideDirection: 'start',
      }),
      shift(),
      arrow({ element: arrowRef }),
    ],
    onComputed({ placement, middlewareData }) {
      const { x, y } = middlewareData.arrow;
      let staticSide, dynamicSide;

      // Split placement into base and variation
      const [basePlacement] = placement.split('-');

      // Define static and dynamic sides based on base placement
      switch (basePlacement) {
        case 'top':
          staticSide = 'bottom';
          dynamicSide = 'left';
          break;
        case 'bottom':
          staticSide = 'top';
          dynamicSide = 'left';
          break;
        case 'left':
          staticSide = 'right';
          dynamicSide = 'bottom';
          break;
        case 'right':
          staticSide = 'left';
          dynamicSide = 'bottom';
          break;
        default:
          staticSide = 'bottom';
          dynamicSide = '50%';
      }

      if ($arrowRef) {
        Object.assign($arrowRef.style, {
          left: x != null ? `${x - 0}px` : '',
          top: y != null ? `${y - 0}px` : '',
          [staticSide]: '-4px',
          [dynamicSide]: 'calc(50% - 4px)',
        });
      }
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
  <slot name="anchor" />
</div>

{#if open || (open === undefined && internalOpen)}
  <div
    class="tooltip"
    use:floatingContent
    {...$$restProps}
  >
    <slot name="content" />
    {#if showArrow}
      <div
        class="tooltip-arrow"
        style="height: {ARROW_HEIGHT}px"
        bind:this={$arrowRef}
      />
    {/if}
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
    padding: var(--fds-spacing-1) var(--fds-spacing-2);
    border-radius: var(--fds-border_radius-medium);
    z-index: 1000;
    overflow-wrap: break-word;
    color: #fff;
    font: var(--fds-typography-paragraph-xsmall);
    font-family: inherit;
  }
  .tooltip-arrow {
    position: absolute;
    background-color: var(--fds-semantic-border-neutral-strong);
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
  }
</style>
