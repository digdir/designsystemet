import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Details } from './';
import * as DetailsStories from './details.stories';

const meta = preview.meta({
  title: 'Chromatic/Details',
  component: Details,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(DetailsStories));
