import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Table } from './';
import * as TableStories from './table.stories';

const meta = preview.meta({
  title: 'Chromatic/Table',
  component: Table,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(TableStories));
