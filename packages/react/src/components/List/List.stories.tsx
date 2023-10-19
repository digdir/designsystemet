import React from 'react';
import type { Meta } from '@storybook/react';

import type { ListProps } from '.';
import { List, ListItem } from '.';

const meta: Meta<typeof List> = {
  title: 'Felles/List',
  component: List,
  args: {
    // Just to make the default option pre-selected i <Controls />
    component: 'ul',
    size: 'medium',
  },
};

export default meta;

export const Preview = (args: ListProps) => (
  <List {...args}>
    <ListItem>List Item 1</ListItem>
    <ListItem>List Item 2</ListItem>
    <ListItem>List Item 3</ListItem>
  </List>
);

export const Advanced = (args: ListProps) => (
  <List {...args}>
    <ListItem>List Item 1</ListItem>
    <ListItem>
      List Item 2
      <List component='ol'>
        <ListItem>List Item 3.1</ListItem>
        <ListItem>List Item 3.2</ListItem>
        <ListItem>List Item 3.3</ListItem>
      </List>
    </ListItem>
    <ListItem>List Item 3</ListItem>
  </List>
);
