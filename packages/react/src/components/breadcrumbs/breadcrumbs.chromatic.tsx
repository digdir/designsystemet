import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import { Breadcrumbs } from '.';
import * as BreadcrumbsStories from './Breadcrumbs.stories';

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
