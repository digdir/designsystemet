<script>
  import { onMount, setContext } from 'svelte';
  import MenuGroup from './DropdownMenuGroup.svelte';
  import MenuItem from './DropdownMenuItem.svelte';
  import Divider from './Divider.svelte';

  const C = {
    MenuGroup,
    MenuItem,
    Divider,
  };

  /**
   * Callback function when dropdown closes
   */
  export let onClose = () => {};

  /**
   * Sets the placement of the dropdown menu relative to the anchor element. Defaults to `bottom-start`.
   * @type {'bottom-start' | 'bottom-end' | 'bottom' | 'top' | 'top-start' | 'top-end' | 'left' | 'right' | 'right-start' | 'right-end' | 'left-start' | 'left-end'}
   */
  export let placement = 'bottom-start';

  /**
   * Controls the size of the dropdown component. Defaults to `medium`.
   * @type {'small' | 'medium' | 'large'}
   */
  export let size = 'medium';

  /**
   * The HTML element that the dropdown menu should be positioned relative to.
   * Be aware that if you want to use a Svelte component as the anchor element, you will need to wrap it in a `<div>` element.
   * @type {HTMLElement}
   */
  export let anchorEl = null;

  $: menuVisible = false;

  onMount(() => {
    if (anchorEl) {
      anchorEl.addEventListener('click', runTrigger);
    }

    return () => {
      anchorEl.removeEventListener('click', runTrigger);
    };
  });

  function runTrigger() {
    setPlacement();
    menuVisible = !menuVisible;
    if (!menuVisible) {
      onClose();
    }
  }
  let parentProps = { size };
  let top = 0,
    left = 0;
  let dropdown = null;
  setContext('parentProps', parentProps);

  function onWindowClick(e) {
    if (menuVisible == false) return;
    if (
      dropdown.contains(e.target) == false &&
      anchorEl.contains(e.target) == false
    ) {
      menuVisible = false;
      onClose();
    }
  }

  function setPlacement() {
    if (anchorEl) {
      let rect = anchorEl.getBoundingClientRect();
      if (placement == 'bottom-start') {
        top = rect.height;
        left = 0;
      } else if (placement == 'bottom-end') {
        top = rect.height;
        left = rect.width - dropdown.getBoundingClientRect().width;
      } else if (placement == 'bottom') {
        top = rect.height;
        left = rect.width / 2 - dropdown.getBoundingClientRect().width / 2;
      } else if (placement == 'top') {
        top = -dropdown.getBoundingClientRect().height;
        left = rect.width / 2 - dropdown.getBoundingClientRect().width / 2;
      } else if (placement == 'top-start') {
        top = -dropdown.getBoundingClientRect().height;
        left = 0;
      } else if (placement == 'top-end') {
        top = -dropdown.getBoundingClientRect().height;
        left = rect.width - dropdown.getBoundingClientRect().width;
      } else if (placement == 'left') {
        top = rect.height / 2 - dropdown.getBoundingClientRect().height / 2;
        left = -dropdown.getBoundingClientRect().width;
      } else if (placement == 'right') {
        top = rect.height / 2 - dropdown.getBoundingClientRect().height / 2;
        left = rect.width;
      } else if (placement == 'right-start') {
        top = 0;
        left = rect.width;
      } else if (placement == 'right-end') {
        top = rect.height - dropdown.getBoundingClientRect().height;
        left = rect.width;
      } else if (placement == 'left-start') {
        top = 0;
        left = -dropdown.getBoundingClientRect().width;
      } else if (placement == 'left-end') {
        top = rect.height - dropdown.getBoundingClientRect().height;
        left = -dropdown.getBoundingClientRect().width;
      }
    }
  }
</script>

<svelte:window on:click={onWindowClick} />

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<ul
  bind:this={dropdown}
  class="dropdown-menu {size}"
  style="top:{top}px; left:{left}px; {menuVisible
    ? 'visibility:visible;'
    : 'visibility:hidden;'}"
  on:click={(event) => {
    event.stopPropagation();
  }}
>
  <slot {C} />
</ul>

<style>
  .dropdown-menu {
    position: absolute;
    display: flex;
    padding: var(--fds-spacing-3, 0.84375rem) var(--fds-spacing-2, 0.5625rem);
    flex-direction: column;
    align-items: flex-start;
    flex: 1 0 0;
    width: 15rem;
    list-style: none;
    z-index: 1500;
    margin: var(--fds-spacing-1) 0 0 0;

    border-radius: var(--fds-border_radius-small, 0.125rem);
    background: #fff;

    /* shadow/medium */
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.12),
      0px 2px 4px 0px rgba(0, 0, 0, 0.12), 0px 0px 1px 0px rgba(0, 0, 0, 0.14);
  }
</style>
