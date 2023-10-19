import React from 'react';
import type { Meta } from '@storybook/react';

import type { ListProps } from '.';
import { List } from '.';

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
    <List.Item>List Item 1</List.Item>
    <List.Item>List Item 2</List.Item>
    <List.Item>List Item 3</List.Item>
  </List>
);

export const Advanced = (args: ListProps) => (
  <List {...args}>
    <List.Item>List Item 1</List.Item>
    <List.Item>
      List Item 2
      <List component='ol'>
        <List.Item>List Item 2.1</List.Item>
        <List.Item>List Item 2.2</List.Item>
        <List.Item>List Item 2.3</List.Item>
      </List>
    </List.Item>
    <List.Item>List Item 3</List.Item>
  </List>
);
