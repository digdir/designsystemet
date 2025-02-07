import type { Meta } from '@storybook/react';
import { Dialog } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as DialogStories from './Dialog.stories';

const meta: Meta = {
  title: 'Chromatic/Dialog',
  component: Dialog,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(DialogStories, meta);
