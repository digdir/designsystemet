import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import type { ListProps } from '.';
import { List, ListItem } from '.';

const meta: Meta<typeof List> = {
  title: 'Kjernekomponenter/List',
  component: List,
  args: {
    // Just to make the default option pre-selected i <Controls />
    borderStyle: 'solid',
  },
};

export default meta;

const Template = (args: ListProps) => (
  <List {...args}>
    <ListItem>List Item 1</ListItem>
    <ListItem>List Item 2</ListItem>
    <ListItem>List Item 3</ListItem>
  </List>
);

export const Props: StoryFn = Template;
