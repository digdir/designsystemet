import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { ErrorSummary } from './';
import * as ErrorSummaryStories from './error-summary.stories';

const meta = preview.meta({
  title: 'Chromatic/ErrorSummary',
  component: ErrorSummary,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(ErrorSummaryStories));
