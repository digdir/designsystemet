import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { SkipLink } from './skip-link';
import * as SkipLinkStories from './skip-link.stories';

const meta = preview.meta({
  title: 'Chromatic/SkipLink',
  component: SkipLink,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(SkipLinkStories));
