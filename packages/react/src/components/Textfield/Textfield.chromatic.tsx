import type { Meta } from '@storybook/react';
import { Textfield } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as TextfieldStories from './Textfield.stories';

const meta: Meta = {
  title: 'Chromatic/Textfield',
  component: Textfield,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(TextfieldStories, meta);
