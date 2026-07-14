import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Button } from './button';
import * as ButtonStories from './button.stories';

const meta = preview.meta({
  title: 'Chromatic/Button',
  component: Button,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(ButtonStories));
