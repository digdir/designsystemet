import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import type { ListProps } from '.';
import { List, ListItem } from '.';

type Story = StoryObj<typeof List>;

export default {
  title: 'Kjernekomponenter/List',
  component: List,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta<typeof List>;

const Template = (args: ListProps) => (
  <List {...args}>
    <ListItem>List Item 1</ListItem>
    <ListItem>List Item 2</ListItem>
    <ListItem>List Item 3</ListItem>
  </List>
);

export const Props: Story = {
  render: Template,
};
export const SolidBorder = {
  render: Template,
  name: 'Solid border',
};

export const DashedBorder = {
  render: Template,
  name: 'Dashed border',

  args: {
    borderStyle: 'dashed',
  },
};
