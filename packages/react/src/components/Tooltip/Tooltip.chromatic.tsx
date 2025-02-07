import type { Meta } from '@storybook/react';
import { Tooltip } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as TooltipStories from './Tooltip.stories';

const meta: Meta = {
  title: 'Chromatic/Tooltip',
  component: Tooltip,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(TooltipStories, meta);
