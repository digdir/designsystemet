import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Combobox } from './index';

export default {
  title: 'Felles/Combobox',
  component: Combobox,
} as Meta;

const FRUITS = [
  {
    name: '🍔 Hamburger',
    value: 'hamburger',
  },
  {
    name: '🍕 Pizza',
    value: 'pizza',
  },
  {
    name: '🍣 Sushi',
    value: 'sushi',
  },
  {
    name: '🍜 Nudler',
    value: 'nudler',
  },
  {
    name: '🍝 Pasta',
    value: 'pasta',
  },
  {
    name: '🍟 Pommes frites',
    value: 'pommes_frites',
  },
];

export const Preview: StoryFn<typeof Combobox> = (args) => {
  return (
    <>
      <Combobox {...args}>
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {FRUITS.map((item, index) => (
          <Combobox.Item
            key={index}
            value={item.value}
          >
            {item.name}
          </Combobox.Item>
        ))}
      </Combobox>
    </>
  );
};

Preview.args = {
  placeholder: 'Velg mat',
  multiple: true,
};
