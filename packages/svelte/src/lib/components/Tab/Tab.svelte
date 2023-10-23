<script>
  export let tabs = [];
  export let activeTab = 0;

  export let tabButtonSize = 'medium';
  export let tabContentSize = 'medium';
</script>

<div class="tab-group">
  {#each tabs as tab, i}
    <button
      class={i === activeTab ? `active ${tabButtonSize}` : `${tabButtonSize}`}
      on:click={() => (activeTab = i)}
      >{#if tab.icon}<div class="icon">
          {@html tab.icon}
        </div>{/if}
      {#if tab.title}
        {tab.title}
      {/if}
    </button>
  {/each}
</div>

<div class={`tab-content ${tabContentSize}`}>
  {#each tabs as tab, i}
    {#if i === activeTab}
      {tab.content}
    {/if}
  {/each}
</div>

<style>
  .tab-group {
    display: inline-flex;
    flex-direction: row;
    border-bottom: var(--fds-border_width-default) solid
      var(--fds-semantic-border-neutral-subtle);
  }

  .icon {
    scale: 1.5;
    display: flex;
  }

  button {
    --fdsc-icon-size: var(--fds-sizing-4);
    --fdsc-typography-font-family: inherit;
    --fdsc-bottom-border-color: transparent;

    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    gap: var(--fds-spacing-2);
    justify-content: center;
    text-align: center;
    align-items: center;
    padding: var(--fds-spacing-2) var(--fds-spacing-3);
    border: none;
    border-radius: 0;
    background-color: transparent;
    cursor: pointer;
    color: var(--fds-semantic-text-neutral-subtle);
    position: relative;
  }

  button.small {
    --fdsc-icon-size: var(--fds-sizing-5);

    font: var(--fds-typography-interactive-small);
    font-family: var(--fdsc-typography-font-family);
    padding: var(--fds-spacing-2) var(--fds-spacing-4);
  }

  button.medium {
    --fdsc-icon-size: var(--fds-sizing-6);

    font: var(--fds-typography-interactive-medium);
    font-family: var(--fdsc-typography-font-family);
    padding: var(--fds-spacing-3) var(--fds-spacing-5);
  }

  button.large {
    --fdsc-icon-size: var(--fds-sizing-7);

    font: var(--fds-typography-interactive-large);
    font-family: var(--fdsc-typography-font-family);
    padding: var(--fds-spacing-4) var(--fds-spacing-6);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover {
      --fdsc-bottom-border-color: var(--fds-semantic-border-neutral-subtle);

      color: var(--fds-semantic-text-neutral-default);
    }
  }

  button.active {
    --fdsc-bottom-border-color: var(--fds-semantic-border-action-default);

    color: var(--fds-semantic-text-action-default);
  }

  button:focus-visible {
    --fdsc-bottom-border-color: var(--fds-semantic-text-neutral-default);

    background: var(--fds-semantic-border-focus-outline);
    color: var(--fds-semantic-text-neutral-default);
    outline: none;
  }

  button::after {
    content: '';
    display: block;
    height: 3px;
    width: 100%;
    border-radius: var(--fds-border_radius-full);
    background-color: var(--fdsc-bottom-border-color);
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .tab-content {
    --fdsc-typography-font-family: inherit;

    font-family: var(--fdsc-typography-font-family);
  }

  .tab-content.small {
    padding: var(--fds-spacing-4);
  }

  .tab-content.medium {
    padding: var(--fds-spacing-5);
  }

  .tab-content.large {
    padding: var(--fds-spacing-6);
  }
</style>
