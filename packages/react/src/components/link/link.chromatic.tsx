import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Link } from './link';
import * as LinkStories from './link.stories';

const meta = preview.meta({
  title: 'Chromatic/Link',
  component: Link,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(LinkStories));
