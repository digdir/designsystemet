import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Button } from '../Button';
import { Paragraph } from '../Typography';
import { Switch } from '../form/Switch';

import { Combobox } from './index';

export default {
  title: 'Felles/Combobox',
  component: Combobox,
} as Meta;

const PLACES = [
  {
    name: 'Leikanger',
    value: 'leikanger',
    description: 'Vestland',
  },
  {
    name: 'Oslo',
    value: 'oslo',
    description: 'Oslo',
  },
  {
    name: 'Brønnøysund',
    value: 'bronnoysund',
    description: 'Nordland',
  },
  {
    name: 'Stavanger',
    value: 'stavanger',
    description: 'Rogaland',
  },
  {
    name: 'Trondheim',
    value: 'trondheim',
    description: 'Trøndelag',
  },
  {
    name: 'Tromsø',
    value: 'tromso',
    description: 'Troms og Finnmark',
  },
  {
    name: 'Bergen',
    value: 'bergen',
    description: 'Vestland',
  },
];

export const Preview: StoryFn<typeof Combobox> = (args) => {
  return (
    <>
      <Combobox {...args}>
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {PLACES.map((item, index) => (
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
  placeholder: 'Velg sted',
  multiple: false,
  readOnly: false,
  disabled: false,
  hideLabel: false,
  size: 'medium',
  label: 'Hvor går reisen?',
};

export const Multiple: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = React.useState<string[]>(['oslo', 'bergen']);

  return (
    <>
      <Paragraph>Value er: {value.join(', ')}</Paragraph>
      <Combobox
        {...args}
        value={value}
        onValueChange={(value) => {
          setValue(value);
        }}
      >
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {PLACES.map((item, index) => (
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
  placeholder: 'Velg steder',
  multiple: true,
  size: 'medium',
  label: 'Hvor går reisen?',
};

export const WithDescription: StoryFn<typeof Combobox> = (args) => {
  return (
    <>
      <Combobox {...args}>
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {PLACES.map((item, index) => (
          <Combobox.Item
            key={index}
            value={item.value}
            description={item.description}
          >
            {item.name}
          </Combobox.Item>
        ))}
      </Combobox>
    </>
  );
};

WithDescription.args = {
  placeholder: 'Velg sted',
  multiple: false,
  size: 'medium',
  label: 'Hvor går reisen?',
};

export const Controlled: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = React.useState<string[]>([]);
  const [multiple, setMultiple] = React.useState<boolean>(false);

  return (
    <>
      <Switch
        checked={multiple}
        onChange={(e) => {
          setMultiple(e.target.checked);
          setValue([]);
        }}
      >
        Multiple
      </Switch>
      <Button
        onClick={() => {
          setValue(['leikanger']);
        }}
        style={{ marginBottom: '1rem' }}
      >
        Sett verdi til Leikanger
      </Button>
      Value er: {value.join(', ')}
      <Combobox
        {...args}
        key={multiple ? 'multiple' : 'single'}
        value={value}
        multiple={multiple}
        onValueChange={(value) => {
          setValue(value);
        }}
      >
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {PLACES.map((item, index) => (
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
