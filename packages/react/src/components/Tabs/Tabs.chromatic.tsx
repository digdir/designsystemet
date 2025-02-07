import type { Meta } from '@storybook/react';
import { Tabs } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as TabsStories from './Tabs.stories';

const meta: Meta = {
  title: 'Chromatic/Tabs',
  component: Tabs,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(TabsStories, meta);
