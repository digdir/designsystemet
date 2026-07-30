import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Skeleton } from './skeleton';
import * as SkeletonStories from './skeleton.stories';

const meta = preview.meta({
  title: 'Chromatic/Skeleton',
  component: Skeleton,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(SkeletonStories));
