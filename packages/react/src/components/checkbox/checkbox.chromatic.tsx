import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Checkbox } from './checkbox';
import * as CheckboxStories from './checkbox.stories';

const meta = preview.meta({
  title: 'Chromatic/Checkbox',
  component: Checkbox,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(CheckboxStories));
