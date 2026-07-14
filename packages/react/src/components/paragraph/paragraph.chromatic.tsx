import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Paragraph } from './paragraph';
import * as ParagraphStories from './paragraph.stories';

const meta = preview.meta({
  title: 'Chromatic/Paragraph',
  component: Paragraph,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(ParagraphStories));
