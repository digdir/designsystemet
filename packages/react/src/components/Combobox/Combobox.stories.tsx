import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Button } from '../Button';

import { Combobox } from './index';

export default {
  title: 'Felles/Combobox',
  component: Combobox,
} as Meta;

const FRUITS = [
  {
    name: '🍔 Hamburger',
    value: 'hamburger',
    description: 'Allergener: Gluten, melk, egg, sennep, soya',
  },
  {
    name: '🍕 Pizza',
    value: 'pizza',
    description: 'Allergener: Gluten, melk, sennep, soya',
  },
  {
    name: '🍣 Sushi',
    value: 'sushi',
    description: 'Allergener: Gluten, fisk, soya',
  },
  {
    name: '🍜 Nudler',
    value: 'nudler',
    description: 'Allergener: Gluten, soya',
  },
  {
    name: '🍝 Pasta',
    value: 'pasta',
    description: 'Allergener: Gluten',
  },
  {
    name: '🍟 Pommes frites',
    value: 'pommes_frites',
    description: 'Allergener: Gluten',
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
  multiple: false,
  size: 'medium',
  label: 'Hvilken mat skal du bestille?',
};

export const Multiple: StoryFn<typeof Combobox> = (args) => {
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

Multiple.args = {
  placeholder: 'Velg mat',
  multiple: true,
  size: 'medium',
  label: 'Hvilken mat skal du bestille?',
};

export const WithDescription: StoryFn<typeof Combobox> = (args) => {
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
            <Combobox.Item.Description>
              {item.description}
            </Combobox.Item.Description>
          </Combobox.Item>
        ))}
      </Combobox>
    </>
  );
};

WithDescription.args = {
  placeholder: 'Velg mat',
  multiple: false,
  size: 'medium',
  label: 'Hvilken mat skal du bestille?',
};

export const Controlled: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <>
      <Button
        onClick={() => {
          setValue(['pizza']);
        }}
        style={{ marginBottom: '1rem' }}
      >
        Sett verdi til pizza
      </Button>
      <Combobox
        {...args}
        value={value}
        onValueChange={(value) => {
          setValue(value);
        }}
      >
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
