<script>
	/**
	 * @prop {string} [size='xlarge'] - Specify the size. Options are 'xxsmall', 'xsmall', 'small', 'medium', 'large' and 'xlarge'.
	 */
	export let level = 1;
	export let size = 'xlarge';
	export let spacing = false;
	export let className = '';

	let Component = level && `h${level}`;
	$: classes = ` ${className} heading ${size} ${spacing ? 'spacing' : ''}`;
</script>

{#if Component === 'h1'}
	<h1 class="{classes} {size} {spacing ? 'spacing' : ''}"><slot /></h1>
{:else if Component === 'h2'}
	<h2 class="{classes} {size} {spacing ? 'spacing' : ''}"><slot /></h2>
{:else if Component === 'h3'}
	<h3 class="{classes} {size} {spacing ? 'spacing' : ''}"><slot /></h3>
{:else if Component === 'h4'}
	<h4 class="{classes} {size} {spacing ? 'spacing' : ''}"><slot /></h4>
{:else if Component === 'h5'}
	<h5 class="{classes} {size} {spacing ? 'spacing' : ''}"><slot /></h5>
{:else if Component === 'h6'}
	<h6 class="{classes} {size} {spacing ? 'spacing' : ''}"><slot /></h6>
{/if}

<style>
	.header {
		margin: 0;
	}

	.heading.spacing {
		margin-bottom: var(--fdsc-bottom-spacing);
	}

	.heading.xlarge {
		--fdsc-bottom-spacing: var(--fds-spacing-6);

		font: var(--fds-typography-heading-xlarge);
		font-family: var(--fdsc-typography-font-family);
	}

	.heading.large {
		--fdsc-bottom-spacing: var(--fds-spacing-5);

		font: var(--fds-typography-heading-large);
		font-family: var(--fdsc-typography-font-family);
	}

	.heading.medium {
		--fdsc-bottom-spacing: var(--fds-spacing-4);

		font: var(--fds-typography-heading-medium);
		font-family: var(--fdsc-typography-font-family);
	}

	.heading.small {
		--fdsc-bottom-spacing: var(--fds-spacing-3);

		font: var(--fds-typography-heading-small);
		font-family: var(--fdsc-typography-font-family);
	}

	.heading.xsmall {
		--fdsc-bottom-spacing: var(--fds-spacing-2);

		font: var(--fds-typography-heading-xsmall);
		font-family: var(--fdsc-typography-font-family);
	}

	.heading.xxsmall {
		--fdsc-bottom-spacing: var(--fds-spacing-1);

		font: var(--fds-typography-heading-xxsmall);
		font-family: var(--fdsc-typography-font-family);
	}
</style>
