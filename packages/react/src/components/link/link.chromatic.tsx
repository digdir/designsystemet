import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import { Link } from '.';
import * as LinkStories from './link.stories';

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
