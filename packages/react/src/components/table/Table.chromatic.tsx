import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import { Table } from '.';
import * as TableStories from './Table.stories';

const meta: Meta = {
  title: 'Chromatic/Table',
  component: Table,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(TableStories, meta);
