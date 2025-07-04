import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import { Fieldset } from '.';
import * as FieldsetStories from './fieldset.stories';

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
