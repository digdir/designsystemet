import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Heading } from './heading';
import * as HeadingStories from './heading.stories';

const meta = preview.meta({
  title: 'Chromatic/Heading',
  component: Heading,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(HeadingStories));
