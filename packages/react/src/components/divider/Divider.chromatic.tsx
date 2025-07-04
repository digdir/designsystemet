import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import { Divider } from '.';
import * as DividerStories from './Divider.stories';

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
