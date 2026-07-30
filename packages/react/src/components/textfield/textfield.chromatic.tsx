import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Textfield } from './textfield';
import * as TextfieldStories from './textfield.stories';

const meta = preview.meta({
  title: 'Chromatic/Textfield',
  component: Textfield,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(TextfieldStories));
