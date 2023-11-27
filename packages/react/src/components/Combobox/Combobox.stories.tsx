import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { data } from './data/data';

import { Combobox } from './index';

export default {
  title: 'Felles/Combobox',
  component: Combobox,
} as Meta;

const FRUITS = [
  '🍔 Hamburger',
  '🍕 Pizza',
  '🍜 Ramen',
  '🍣 Sushi',
  '🍝 Pasta',
  '🍟 Pommes frites',
];

export const Preview: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = useState('');

  return (
    <>
      <p>Value: {value}</p>
      <Combobox
        {...args}
        onValueChange={(e) => setValue(e)}
      >
        {FRUITS.map((item, index) => (
          <Combobox.Item
            key={index}
            value={item}
          >
            {item}
          </Combobox.Item>
        ))}
      </Combobox>
    </>
  );
};

Preview.args = {
  placeholder: 'Velg mat',
};
