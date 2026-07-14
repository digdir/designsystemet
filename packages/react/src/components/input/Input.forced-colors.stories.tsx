import preview from '../../../../../apps/storybook/.storybook/preview';
import * as stories from './input.stories';

// biome-ignore lint:style/noExplicitAny: Storybook CSF next requires a meta const to run
const meta = preview.meta({
  title: 'Komponenter/Input/Forced Colors',
  tags: ['test', '!dev'],
});

const forcedColors = {
  parameters: {
    chromatic: {
      forcedColors: 'active',
    },
  },
} as Parameters<typeof stories.Preview.extend>[0];

export const Preview = stories.Preview.extend(forcedColors);
export const Text = stories.Text.extend(forcedColors);
export const Checkbox = stories.Checkbox.extend(forcedColors);
export const Switch = stories.Switch.extend(forcedColors);
export const Radio = stories.Radio.extend(forcedColors);
