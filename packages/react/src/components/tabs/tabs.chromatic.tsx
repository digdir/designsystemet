import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Tabs } from './';
import * as TabsStories from './tabs.stories';

const meta = preview.meta({
  title: 'Chromatic/Tabs',
  component: Tabs,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(TabsStories));
