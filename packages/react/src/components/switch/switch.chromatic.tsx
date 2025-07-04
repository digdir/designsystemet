import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import { Switch } from '.';
import * as SwitchStories from './switch.stories';

const meta: Meta = {
  title: 'Chromatic/Switch',
  component: Switch,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(SwitchStories, meta);
