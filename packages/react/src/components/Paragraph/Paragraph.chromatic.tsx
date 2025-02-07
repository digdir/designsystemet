import type { Meta } from '@storybook/react';
import { Paragraph } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as ParagraphStories from './Paragraph.stories';

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
