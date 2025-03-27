import type { Meta } from '@storybook/react';
import { ToggleGroup } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as ToggleGroupStories from './ToggleGroup.stories';

const meta: Meta = {
  title: 'Chromatic/ToggleGroup',
  component: ToggleGroup,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      /* 80vw since storybook has padding, and does not stop elements from overflowing the x-axis */
      <div style={{ maxWidth: '80vw' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

export const Snapshots = createSingleStory(ToggleGroupStories, meta);
