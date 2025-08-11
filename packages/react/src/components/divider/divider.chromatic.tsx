import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Divider } from './divider';
import * as DividerStories from './divider.stories';

const meta: Meta = {
  title: 'Chromatic/Divider',
  component: Divider,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(DividerStories, meta);
