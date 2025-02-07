import type { Meta } from '@storybook/react';
import { ValidationMessage } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as ValidationMessageStories from './ValidationMessage.stories';

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
