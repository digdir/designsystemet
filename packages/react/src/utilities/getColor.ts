export function getColor<T>(color: T, type?: 'action') {
  if (type === 'action') {
    switch (color) {
      case 'first':
        return 'accent';
      case 'second':
        return 'neutral';
      default:
        return color;
    }
  }

  switch (color) {
    case 'first':
      return 'brand1';
    case 'second':
      return 'brand2';
    case 'third':
      return 'brand3';
    default:
      return color;
  }
}
