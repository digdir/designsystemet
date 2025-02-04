import type { Meta } from '@storybook/react';
import { Field } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as FieldStories from './Field.stories';

const meta: Meta = {
  title: 'Chromatic/Field',
  component: Field,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(FieldStories, meta);
