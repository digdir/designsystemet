import type { Meta } from '@storybook/react';
import { Input } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as InputStories from './Input.stories';

const meta: Meta = {
  title: 'Chromatic/Input',
  component: Input,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(InputStories, meta);
