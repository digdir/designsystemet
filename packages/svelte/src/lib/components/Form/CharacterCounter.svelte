<script>
  export let label = defaultLabel;
  export let srLabel = '';
  export let maxCount;
  export let value;
  export let id;
  export let size = 'medium';

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
    case 'large':
      fontSizeClass = 'font-large';
      break;
    default:
      fontSizeClass = 'font-medium';
      break;
  }

  function defaultLabel(count) {
    return count > -1
      ? `${count} tegn igjen`
      : `${Math.abs(count)} tegn for mye`;
  }

  function defaultSrLabel(maxCount) {
    return `Tekstfelt med plass til ${maxCount} tegn`;
  }

  $: currentCount = maxCount - value.length;
  $: hasExceededLimit = value.length > maxCount;
  $: finalSrLabel = srLabel || defaultSrLabel(maxCount);
</script>

<span
  class={`visuallyHidden ${fontSizeClass}`}
  {id}
>
  {finalSrLabel}
</span>

<span
  class={`${hasExceededLimit ? 'error' : ''} ${fontSizeClass}`}
  aria-live={hasExceededLimit ? 'polite' : 'off'}
>
  {label ? label(currentCount) : defaultLabel(currentCount)}
</span>

<style>
  .error {
    color: red;
  }

  .visuallyHidden {
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px 1px 1px 1px);
    clip: rect(1px, 1px, 1px, 1px);
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
  .font-large {
    font-size: 1.25rem;
  }
</style>
