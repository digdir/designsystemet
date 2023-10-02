<script>
	import InformationSquareFillIcon from '@navikt/aksel-icons/svg/InformationSquareFill.svg?raw';
	import CheckmarkCircleFillIcon from '@navikt/aksel-icons/svg/CheckmarkCircleFill.svg?raw';
	import XMarkOctagonFillIcon from '@navikt/aksel-icons/svg/XMarkOctagonFill.svg?raw';
	import ExclamationmarkTriangleFillIcon from '@navikt/aksel-icons/svg/ExclamationmarkTriangleFill.svg?raw';

	import Paragraph from '../Typography/Paragraph/Paragraph.svelte';

	/**
	 * Alert component to show notifications with varying severity.
	 * @prop {string} [severity='info'] - Sets color & icon according to severity. Options are 'info', 'warning', 'success', or 'danger'.
	 * @prop {boolean} [elevated=false] - Adds a shadow to elevate the component.
	 * @prop {string} [iconTitle] - Sets `title` on the icon. Use this to inform screenreaders of severity. Defaults to Norwegian.
	 */
	export let severity = 'info';
	export let elevated = false;
	export let iconTitle = '';

	const icons = {
		info: {
			Icon: InformationSquareFillIcon,
			title: 'Informasjon'
		},
		warning: {
			Icon: ExclamationmarkTriangleFillIcon,
			title: 'Advarsel'
		},
		success: {
			Icon: CheckmarkCircleFillIcon,
			title: 'Suksess'
		},
		danger: {
			Icon: XMarkOctagonFillIcon,
			title: 'Feil'
		}
	};

	const { Icon, title } = icons[severity];
</script>

<div class={`alert ${severity} ${elevated ? 'elevated' : ''}`}>
	<div class="icon">
		{@html Icon}
	</div>
	<!-- <svelte:component this={Icon} title={iconTitle || title} class="icon" /> -->
	<Paragraph as="span" className="content">
		<slot />
	</Paragraph>
</div>

<style>
	.alert {
		--fdsc-alert-border: var(--fds-semantic-border-info-default);
		--fdsc-alert-icon-color: var(--fdsc-alert-border);
		--fdsc-alert-background: var(--fds-semantic-surface-info-subtle);
		--fdsc-alert-color: var(--fds-semantic-text-neutral-default);
		--fdsc-alert-box-shadow-left: 8px 0 0 0 var(--fdsc-alert-border) inset;

		box-shadow: var(--fdsc-alert-box-shadow-left);
		background: var(--fdsc-alert-background);
		color: var(--fdsc-alert-color);
		padding: var(--fds-spacing-4);
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: min-content auto;
		gap: var(--fds-spacing-2);
	}

	.icon {
		--icon-size: calc((4 * 6 / 16) * var(--fds-font-size-f0)); /** Fluid sizing-6 */

		height: var(--icon-size);
		width: var(--icon-size);
		color: var(--fdsc-alert-icon-color);
	}

	.content {
		display: flex;
		flex-direction: column;
	}

	.info {
		--fdsc-alert-border: var(--fds-semantic-border-info-default);
		--fdsc-alert-background: var(--fds-semantic-surface-info-subtle);
	}

	.warning {
		--fdsc-alert-border: var(--fds-semantic-border-warning-default);
		--fdsc-alert-background: var(--fds-semantic-surface-warning-subtle);
	}

	.success {
		--fdsc-alert-border: var(--fds-semantic-border-success-default);
		--fdsc-alert-background: var(--fds-semantic-surface-success-subtle);
	}

	.danger {
		--fdsc-alert-border: var(--fds-semantic-border-danger-default);
		--fdsc-alert-background: var(--fds-semantic-surface-danger-subtle);
	}

	.elevated {
		box-shadow: var(--fdsc-alert-box-shadow-left), var(--fds-shadow-small);
	}
</style>
