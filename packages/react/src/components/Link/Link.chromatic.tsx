import type { Meta } from '@storybook/react';
import { Link } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as LinkStories from './Link.stories';

const meta: Meta = {
  title: 'Chromatic/Link',
  component: Link,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(LinkStories, meta);
