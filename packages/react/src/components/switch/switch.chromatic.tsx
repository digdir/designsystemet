import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Switch } from './switch';
import * as SwitchStories from './switch.stories';

const meta = preview.meta({
  title: 'Chromatic/Switch',
  component: Switch,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(SwitchStories));
