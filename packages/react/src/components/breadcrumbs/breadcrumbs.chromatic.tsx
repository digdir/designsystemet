import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Breadcrumbs } from './';
import * as BreadcrumbsStories from './breadcrumbs.stories';

const meta: Meta = {
  title: 'Chromatic/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(BreadcrumbsStories, meta);
