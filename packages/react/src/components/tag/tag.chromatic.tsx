import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Tag } from './tag';
import * as TagStories from './tag.stories';

const meta = preview.meta({
  title: 'Chromatic/Tag',
  component: Tag,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(TagStories));
