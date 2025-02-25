import type { Meta } from '@storybook/react';
import { Fieldset } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as FieldsetStories from './Fieldset.stories';

const meta: Meta = {
  title: 'Chromatic/Fieldset',
  component: Fieldset,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(FieldsetStories, meta);
