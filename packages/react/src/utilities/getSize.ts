export function getSize<T>(size: T) {
  switch (size) {
    case 'xxxsmall':
      return '3xs';
    case 'xxsmall':
      return '2xs';
    case 'xsmall':
      return 'xs';
    case 'small':
      return 'sm';
    case 'medium':
      return 'md';
    case 'large':
      return 'lg';
    case 'xlarge':
      return 'xl';
    case 'xxlarge':
      return '2xl';
    case 'xxxlarge':
      return '3xl';
    case 'xxxxlarge':
      return '4xl';
    default:
      return size;
  }
}
