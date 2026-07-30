import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Alert } from '../';
import * as AlertStories from './alert.stories';

const meta = preview.meta({
  title: 'Chromatic/Alert',
  component: Alert,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(AlertStories));
