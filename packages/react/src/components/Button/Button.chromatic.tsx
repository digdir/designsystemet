import type { Meta } from '@storybook/react';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import { Button } from './Button';
import * as ButtonStories from './Button.stories';

const meta: Meta = {
  title: 'Chromatic/Button',
  component: Button,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(ButtonStories, meta);
export const ColorsPressed = ButtonStories.Colors.bind({});
ColorsPressed.parameters = {
  pseudo: { active: true },
  chromatic: { modes: { mobile: { disable: true } }, disableSnapshot: false },
};
export const ColorsHover = ButtonStories.Colors.bind({});
ColorsHover.parameters = {
  pseudo: { hover: true },
  chromatic: { modes: { mobile: { disable: true } }, disableSnapshot: false },
};
