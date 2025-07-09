import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Spinner } from './';
import * as SpinnerStories from './spinner.stories';

const meta: Meta = {
  title: 'Chromatic/Spinner',
  component: Spinner,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(SpinnerStories, meta);
