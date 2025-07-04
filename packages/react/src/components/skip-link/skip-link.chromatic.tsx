import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import { SkipLink } from '.';
import * as SkipLinkStories from './skip-link.stories';

const meta: Meta = {
  title: 'Chromatic/SkipLink',
  component: SkipLink,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(SkipLinkStories, meta);
