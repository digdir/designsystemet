import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Paragraph } from './paragraph';
import * as ParagraphStories from './paragraph.stories';

const meta: Meta = {
  title: 'Chromatic/Paragraph',
  component: Paragraph,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(ParagraphStories, meta);
