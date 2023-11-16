import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Link } from '../Link';

import { List } from '.';

type Story = StoryFn<typeof List>;

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

export const Preview: Story = (args) => (
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

export const WithHeading: Story = (args) => (
  <List
    {...args}
    heading='Hva vi kan ha til middag i dag'
  >
    <List.Item>Lasagne</List.Item>
    <List.Item>Taco</List.Item>
    <List.Item>Pizza</List.Item>
  </List>
);

export const Advanced: Story = (args) => (
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

export const LinkList: Story = (args) => (
  <List
    {...args}
    heading='Designsystemet'
    style={{
      listStyle: 'none',
      paddingLeft: 0,
    }}
  >
    <List.Item>
      <Link
        href='https://www.designsystemet.no/grunnleggende'
        target='_blank'
      >
        Grunnleggende
      </Link>
    </List.Item>
    <List.Item>
      <Link
        href='https://www.designsystemet.no/god-praksis'
        target='_blank'
      >
        God praksis
      </Link>
    </List.Item>
    <List.Item>
      <Link
        href='https://www.designsystemet.no/monstre'
        target='_blank'
      >
        Mønstre
      </Link>
    </List.Item>
  </List>
);
