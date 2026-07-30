import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Radio } from './radio';
import * as RadioStories from './radio.stories';

const meta = preview.meta({
  title: 'Chromatic/Radio',
  component: Radio,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(RadioStories));
