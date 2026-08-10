import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Textarea } from './textarea';
import * as TextareaStories from './textarea.stories';

const meta = preview.meta({
  title: 'Chromatic/Textarea',
  component: Textarea,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(TextareaStories));
