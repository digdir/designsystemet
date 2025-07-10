import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { ErrorSummary } from './';
import * as ErrorSummaryStories from './error-summary.stories';

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
