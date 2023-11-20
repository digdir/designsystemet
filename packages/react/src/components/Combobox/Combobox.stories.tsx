import React, { useMemo, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { data } from './data/data';

import { Combobox } from './index';

export default {
  title: 'Felles/Combobox',
  component: Combobox,
} as Meta;

export const Preview: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = useState('');

  const filteredOptions = useMemo(
    () =>
      data.filter((item) => item.toLowerCase().includes(value.toLowerCase())),
    [value],
  );

  return (
    <Combobox
      {...args}
      onValueChange={(e) => setValue(e)}
    >
      {filteredOptions.map((item) => (
        <Combobox.Item
          key={item}
          value={item}
        >
          {item}
        </Combobox.Item>
      ))}
    </Combobox>
  );
};
