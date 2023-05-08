import React from 'react';

import { List, ListItem } from '.';

const Template = (args = {}) => (
  <List {...args}>
    <ListItem>List Item 1</ListItem>
    <ListItem>List Item 2</ListItem>
    <ListItem>List Item 3</ListItem>
  </List>
);

export default {
  title: 'Kjernekomponenter/List',
  component: List,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
};

export const Props = {
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
