import * as stories from './Input.stories';

export default {
  ...stories.default,
  title: 'Komponenter/Input/Forced Colors',
  parameters: {
    chromatic: {
      forcedColors: 'active',
    },
  },
};
