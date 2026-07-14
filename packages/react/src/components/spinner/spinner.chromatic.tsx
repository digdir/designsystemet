import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Spinner } from './spinner';
import * as SpinnerStories from './spinner.stories';

const meta = preview.meta({
  title: 'Chromatic/Spinner',
  component: Spinner,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(SpinnerStories));
