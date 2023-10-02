<script>
	/**
	 * List component to render an unordered list with customizable border styles between items.
	 * @prop {string} [borderStyle='solid'] - The style of border between items. Options are 'solid' or 'dashed'.
	 * @prop {string} [className=''] - Additional classes to add to the component.
	 */
	let borderStyle = 'solid';
	let className = '';

	$: computedClass = `${'list'} .${borderStyle} ${className}`;
</script>

<ul class={computedClass}>
	<slot />
</ul>

<style lang="scss">
	.list {
		--component-list-border_width: 1px;

		border-top-color: var(--component-list-border_color);
		border-top-style: var(--component-list-border_style);
		border-top-width: var(--component-list-border_width);
		list-style-type: none;
		padding-left: 0;

		&.solid {
			--component-list-border_color: #bcc7cc;
			--component-list-border_style: solid;
		}

		&.dashed {
			--component-list-border_color: #1eadf7;
			--component-list-border_style: dashed;
		}
	}
</style>
