import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { ValidationMessage } from './validation-message';
import * as ValidationMessageStories from './validation-message.stories';

const meta = preview.meta({
  title: 'Chromatic/ValidationMessage',
  component: ValidationMessage,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(
  createSingleStory(ValidationMessageStories),
);
