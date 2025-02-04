import type { Meta } from '@storybook/react';
import { Card } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as CardStories from './Card.stories';

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
