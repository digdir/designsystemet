import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { data } from './data/data';

import { Combobox } from './index';

export default {
  title: 'Felles/Combobox',
  component: Combobox,
} as Meta;

export const Preview: StoryFn<typeof Combobox> = (args) => (
  <Combobox {...args}>
    {data.map((item) => (
      <Combobox.Item
        key={item}
        value={item}
      >
        {item}
      </Combobox.Item>
    ))}
  </Combobox>
);
