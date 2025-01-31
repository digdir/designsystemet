import * as stories from './Input.stories';

export default {
  ...stories.default,
  title: 'Komponenter/Input/Forced Colors',
  parameters: {
    chromatic: {
      forcedColors: 'active',
    },
  },
  tags: ['test', '!dev'],
};

export const Preview = stories.Preview;
export const Text = stories.Text;
export const Checkbox = stories.Checkbox;
export const Switch = stories.Switch;
export const Radio = stories.Radio;
