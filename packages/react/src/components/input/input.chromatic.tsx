import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Input } from './input';
import * as InputStories from './input.stories';

const meta = preview.meta({
  title: 'Chromatic/Input',
  component: Input,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(InputStories));
