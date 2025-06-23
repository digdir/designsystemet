import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import { Tabs } from '.';
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
