import type { Meta } from '@storybook/react';
import { Switch } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as SwitchStories from './Switch.stories';

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
