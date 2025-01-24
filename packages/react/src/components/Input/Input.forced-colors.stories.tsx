import * as stories from './Input.stories';

export default {
  ...stories,
  parameters: {
    chromatic: {
      forcedColors: 'active',
    },
  },
};
