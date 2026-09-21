import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Field } from './';
import * as FieldStories from './field.stories';

const meta = preview.meta({
  title: 'Chromatic/Field',
  component: Field,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(FieldStories));
