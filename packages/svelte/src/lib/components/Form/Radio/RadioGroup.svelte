<script>
  import { setContext, createEventDispatcher } from 'svelte';
  import { v4 as uuidv4 } from 'uuid';

  /**
   * RadioGroup
   *
   * @prop {string} [legend=''] - The legend of the fieldset.
   * @prop {string} [description=''] - A description of the fieldset. This will appear below the legend.
   * @prop {boolean} [readOnly=false] - Toggle readOnly on fieldset context.
   * @prop {boolean} [disabled=false] - Toggle disabled all input fields within the fieldset.
   * @prop {string} [error=''] - If set, this will diplay an error message at the bottom of the fieldset.
   * @prop {string} [value] - Controlled state for Radio.
   * @prop {string} [defaultValue=''] - Default checked Radio
   * @prop {boolean} [required=false] - Toggle if collection of Radio are required. Note: Not fully implemented for Svelte.
   * @prop {boolean} [inline=false] - Orientation of Radio components.
   * @prop {string} [size='medium'] - Changes field size and paddings.
   * @prop {boolean} [hideLegend=false] - Visually hide legend and description (still available for screen readers).
   */

  export let legend = '';
  export let description = '';
  export let readOnly = false;
  export let disabled = false;
  export let error = '';
  export let value;
  export let defaultValue = '';
  export let required = false;
  export let inline = false;
  export let size = 'medium';
  export let hideLegend = false;

  const uniqueId = uuidv4();

  if (value === undefined || value === '') value = defaultValue;

  let fontSizeClass;
  switch (size) {
    case 'xsmall':
      fontSizeClass = 'font-xsmall';
      break;
    case 'small':
      fontSizeClass = 'font-small';
      break;
    case 'medium':
      fontSizeClass = 'font-medium';
      break;
    default:
      fontSizeClass = 'font-medium';
      break;
  }

  let radioGroupClasses = `radio-group ${readOnly ? 'readonly' : ''} ${size}`;
  let legendClasses = `legend ${fontSizeClass} ${
    hideLegend ? 'visually-hidden' : ''
  }`;
  let descriptionClasses = `description ${fontSizeClass}  ${
    hideLegend ? 'visually-hidden' : ''
  }`;
  let errorClasses = `error ${fontSizeClass}`;

  setContext('radioGroup', {
    readOnly,
    disabled,
    size,
    value,
    error,
    uniqueId,
    required,
  });

  const dispatch = createEventDispatcher();
  function handleChange(event) {
    if (event.target.type === 'radio') {
      value = event.target.value;
      dispatch('change', value);
    }
  }
</script>

<fieldset
  class={radioGroupClasses}
  id={`group-${uniqueId}`}
  aria-labelledby={`label-${uniqueId}`}
  on:change={handleChange}
>
  {#if legend}
    {#if readOnly}
      <span
        aria-hidden
        class="padlock-icon">🔒</span
      >
    {/if}
    <legend
      class={legendClasses}
      id={`label-${uniqueId}`}
    >
      {legend}
    </legend>
  {/if}
  {#if description}
    <p class={descriptionClasses}>
      {description}
    </p>
  {/if}

  <div class={inline ? 'radio-group-inline' : ''}>
    <slot />
  </div>
  {#if error}
    <p class={errorClasses}>{error}</p>
  {/if}
</fieldset>

<style>
  .radio-group-inline {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
  }

  .font-xsmall {
    font-size: 0.8125rem;
  }
  .font-small {
    font-size: 0.9375rem;
  }
  .font-medium {
    font-size: 1.125rem;
  }

  .error {
    color: var(--fds-semantic-border-danger-default);
  }

  .visually-hidden {
    border: 0;
    clip: rect(0 0 0 0);
    height: 0.0625rem;
    margin: -0.0625rem;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 0.0625rem;
  }

  fieldset {
    border: none;
    margin: 0;
    padding: 0;
    display: block;
  }

  legend {
    font-weight: 500;
    padding: 0;
    margin: 0;
    display: table;
    max-width: 100%;
    white-space: normal;
    color: inherit;
    font-size: inherit;
    line-height: inherit;
    align-self: flex-start;
  }
  p {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    font-weight: 400;
    color: var(--fds-semantic-text-neutral-subtle);
  }
</style>
