import type { Meta } from '@storybook/react';
import { ErrorSummary } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as ErrorSummaryStories from './ErrorSummary.stories';

const meta: Meta = {
  title: 'Chromatic/ErrorSummary',
  component: ErrorSummary,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(ErrorSummaryStories, meta);
