import * as stories from './Input.stories';

export default {
  ...stories,
  title: 'Komponenter/Input/Forced Colors',
  parameters: {
    chromatic: {
      forcedColors: 'active',
    },
  },
};
