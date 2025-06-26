import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import { Spinner } from '.';
import * as SpinnerStories from './Spinner.stories';

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
