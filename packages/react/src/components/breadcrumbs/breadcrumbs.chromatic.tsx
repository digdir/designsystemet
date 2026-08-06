import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Breadcrumbs } from './';
import * as BreadcrumbsStories from './breadcrumbs.stories';

const meta = preview.meta({
  title: 'Chromatic/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(BreadcrumbsStories));
