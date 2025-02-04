import type { Meta } from '@storybook/react';
import { Label } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as LabelStories from './Label.stories';

const meta: Meta = {
  title: 'Chromatic/Label',
  component: Label,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(LabelStories, meta);
