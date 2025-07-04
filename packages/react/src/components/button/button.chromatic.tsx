import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import { Button } from './button';
import * as ButtonStories from './button.stories';

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
