import type no from '../no/color-modal';

export default {
  'see-more': 'See more about {{namespace}} {{color}}',
  hexcode: 'Hexcode',
  'css-variable': 'CSS variable',
  'relative-luminance': 'Relative luminance',
  'can-be-used-against': 'Can be used against',
  'color-combinations': {
    'all-colors': 'All colors',
    'background-subtle-and-default': 'Background subtle and Default',
    'background-colors-and-surface-default':
      'Background colors and Surface Default',
    'background-colors-and-surface-colors':
      'Background colors and Surface colors',
    'base-colors': 'Base colors',
  },
  override: {
    'overridden-light': 'This color is overridden in light mode.',
    'overridden-dark': 'This color is overridden in dark mode.',
    'check-contrast': 'Make sure to check contrasts after changes.',
    reset: 'Reset to generated color',
    from: 'Overridden from generated color',
    to: 'to',
    'hint-light':
      'Click the color step in the scale to pick your own color for light mode.',
    'hint-dark':
      'Click the color step in the scale to pick your own color for dark mode.',
  },
} satisfies typeof no;
