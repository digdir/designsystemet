import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Label } from './label';
import * as LabelStories from './label.stories';

const meta = preview.meta({
  title: 'Chromatic/Label',
  component: Label,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(LabelStories));
