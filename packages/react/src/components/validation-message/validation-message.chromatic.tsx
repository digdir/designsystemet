import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { ValidationMessage } from '.';
import * as ValidationMessageStories from './validation-message.stories';

const meta: Meta = {
  title: 'Chromatic/ValidationMessage',
  component: ValidationMessage,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(ValidationMessageStories, meta);
