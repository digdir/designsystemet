import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import type { ListProps } from '.';
import { List } from '.';

const decorators = [
  (Story: StoryFn) => (
    <div style={{ margin: '5rem' }}>
      <Story />
    </div>
  ),
];

export default {
  title: 'Felles/List',
  component: List,
  decorators,
} as Meta;

export const Preview = (args: ListProps) => (
  <List {...args}>
    <List.Item>List Item 1</List.Item>
    <List.Item>List Item 2</List.Item>
    <List.Item>List Item 3</List.Item>
  </List>
);

Preview.args = {
  as: 'ul',
  size: 'medium',
};

export const WithHeading = (args: ListProps) => (
  <List
    {...args}
    heading='Hva vi kan ha til middag i dag'
  >
    <List.Item>Lasagne</List.Item>
    <List.Item>Taco</List.Item>
    <List.Item>Pizza</List.Item>
  </List>
);

export const Advanced = (args: ListProps) => (
  <List {...args}>
    <List.Item>List Item 1</List.Item>
    <List.Item>
      List Item 2
      <List as='ol'>
        <List.Item>List Item 2.1</List.Item>
        <List.Item>List Item 2.2</List.Item>
        <List.Item>List Item 2.3</List.Item>
      </List>
    </List.Item>
    <List.Item>List Item 3</List.Item>
  </List>
);
