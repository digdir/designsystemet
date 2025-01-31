import type { Meta } from '@storybook/react';
import { Alert } from '.';
import { createSingleStory } from '../../utilities/createSingleStory';
import * as AlertStories from './Alert.stories';

const meta: Meta = {
  title: 'Komponenter/Alert/Visual tests',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const SnapshotStory = createSingleStory(AlertStories, meta);
