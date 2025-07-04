import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import { Field } from '.';
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
