import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Alert } from '../';
import * as AlertStories from './alert.stories';

const meta: Meta = {
  title: 'Chromatic/Alert',
  component: Alert,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(AlertStories, meta);
