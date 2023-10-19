<script>
	import { setContext } from 'svelte';

	export let border;
	export let color;

	setContext('accordion', { border, color });
</script>

<div class={`accordion ${color}`} class:border>
	<slot />
</div>

<style>
	.accordion {
		--fdsc-accordion-border: var(--fds-semantic-border-neutral-subtle);
		--fdsc-accordion-border-radius: 3px;
		--fdsc-accordion-header-padding-top: var(--fds-spacing-4);
		--fdsc-accordion-header-padding-right: var(--fds-spacing-5);
		--fdsc-accordion-header-padding-bottom: var(--fds-spacing-4);
		--fdsc-accordion-header-padding-left: var(--fds-spacing-5);
		--fdsc-accordion-header-bg-neutral: var(--fds-semantic-surface-neutral-default);
		--fdsc-accordion-header-bg-neutral-active: var(
			--fds-semantic-surface-action-first-no_fill-hover
		);
		--fdsc-accordion-header-bg-subtle: var(--fds-semantic-surface-neutral-subtle);
		--fdsc-accordion-header-bg-subtle-hover: var(--fds-semantic-surface-neutral-subtle-hover);
		--fdsc-accordion-header-bg-primary: var(--fds-semantic-surface-first-light);
		--fdsc-accordion-header-bg-primary-hover: var(--fds-semantic-surface-first-light-hover);
		--fdsc-accordion-header-bg-secondary: var(--fds-semantic-surface-second-light);
		--fdsc-accordion-header-bg-secondary-hover: var(--fds-semantic-surface-second-light-hover);
		--fdsc-accordion-header-bg-tertiary: var(--fds-semantic-surface-third-light);
		--fdsc-accordion-header-bg-tertiary-hover: var(--fds-semantic-surface-third-light-hover);
		--fdsc-accordion-header-border: var(--fds-semantic-border-neutral-subtle);
		--fdsc-accordion-header-border-inverted: var(--fds-semantic-border-on_inverted-default);
		--fdsc-accordion-header-shadow-focus: 2px 2px 3px var(--fds-semantic-border-neutral-subtle);
		--fdsc-accordion-header-color-hover: var(--fds-semantic-text-action-first-default);
		--fdsc-accordion-content-border: var(--fds-semantic-border-neutral-subtle);
		--fdsc-accordion-content-border-open: var(--fds-semantic-border-neutral-strong);

		border-bottom: 1px solid var(--fdsc-accordion-content-border);
	}

	.border {
		border: 1px solid var(--fdsc-accordion-border);
		border-radius: var(--fdsc-accordion-border-radius);
	}

	.accordion.neutral {
		background: var(--fdsc-accordion-header-bg-neutral);
	}

	.accordion.subtle {
		background: var(--fdsc-accordion-header-bg-subtle);
	}

	.accordion.first {
		background: var(--fdsc-accordion-header-bg-primary);
	}

	.accordion.second {
		background: var(--fdsc-accordion-header-bg-secondary);
	}

	.accordion.third {
		background: var(--fdsc-accordion-header-bg-tertiary);
	}
</style>
