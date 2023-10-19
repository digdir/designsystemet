import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { countries } from './test-data/countries';
import { getCountryName } from './test-data/getCountryName';
import { customFilter } from './test-data/customFilter';

import { EXPERIMENTAL_Combobox } from '.';

type Story = StoryObj<typeof EXPERIMENTAL_Combobox>;

export default {
  title: 'Felles/Combobox',
  component: EXPERIMENTAL_Combobox,
} as Meta;

export const Standard: Story = {
  args: {
    label: 'Velg et land',
    options: Object.values(countries),
  },
};

export const MedLedetekst: Story = {
  args: {
    label: 'Velg en landkode',
    options: Object.keys(countries),
    optionLabel: (code: string) => `${code} (${getCountryName(code)})`,
  },
};

export const Formatert: Story = {
  args: {
    label: 'Velg en landkode',
    options: Object.keys(countries),
    optionLabel: (code: string) => (
      <span>
        <strong>{getCountryName(code)}</strong> {code}
      </span>
    ),
  },
};

export const MedEgendefinertFilter: Story = {
  args: {
    label: 'Velg en landkode',
    options: Object.keys(countries),
    optionLabel: (code: string) => `${code} (${getCountryName(code)})`,
    filter: customFilter,
    placeholder: 'Begynn å skrive et landnavn',
  },
};
