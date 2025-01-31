import type { Meta } from '@storybook/react';
import { Alert } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as AlertStories from './Alert.stories';

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
