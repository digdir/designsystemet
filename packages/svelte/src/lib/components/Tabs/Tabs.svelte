<!-- Tabs.svelte -->
<script>
  import { setContext } from 'svelte';
  import { nanoid } from 'nanoid'; // Du må installere nanoid eller bruke en annen metode for å generere unik id
  import { selectedTab, tabSize } from './store.js';

  const TABS_CONTEXT_KEY = `tabs-${nanoid()}`;

  /**
   * onchange handler for the tabs component.
   */
  export let onChange = (value) => {};

  /**
   * Sets the default value of the tabs component.
   * @type {string}
   */
  export let defaultValue = undefined;

  /**
   * Controls the size of the tabs component. Defaults to `medium`.
   * @type {'small' | 'medium' | 'large'}
   */
  export let size = 'medium';

  function selectTab(value) {
    $selectedTab = value;
  }
  $tabSize = size;
  $selectedTab = defaultValue ? defaultValue : '1';
  setContext(TABS_CONTEXT_KEY, { selectedTab, selectTab, tabSize });
  $: onChange($selectedTab);
</script>

<div class="tabs">
  <slot />
</div>
