import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Textfield } from './textfield';
import * as TextfieldStories from './textfield.stories';

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
