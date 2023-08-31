import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { countries } from './test-data/countries';

import { Combobox } from '.';

type Story = StoryObj<typeof Combobox>;

export default {
  title: 'Felles/Combobox',
  component: Combobox,
} as Meta;

export const Normal: Story = {
  args: {
    label: 'Velg et alternativ',
    options: Object.entries(countries).map(([value, name]) => ({
      label: `${name} (${value})`,
      value,
    })),
  },
};

export const Formatert: Story = {
  args: {
    label: 'Velg et alternativ',
    options: Object.entries(countries).map(([value, name]) => ({
      label: (
        <span>
          <strong>{name}</strong> {value}
        </span>
      ),
      value,
    })),
  },
};
