import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Tabs } from '.';
import * as TabsStories from './tabs.stories';

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
