import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Fieldset } from './';
import * as FieldsetStories from './fieldset.stories';

const meta = preview.meta({
  title: 'Chromatic/Fieldset',
  component: Fieldset,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(FieldsetStories));
