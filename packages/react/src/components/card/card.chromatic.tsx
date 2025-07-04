import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import { Card } from '.';
import * as CardStories from './card.stories';

const meta: Meta = {
  title: 'Chromatic/Card',
  component: Card,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(CardStories, meta);
