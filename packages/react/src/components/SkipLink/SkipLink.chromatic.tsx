import type { Meta } from '@storybook/react';
import { SkipLink } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as SkipLinkStories from './SkipLink.stories';

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
