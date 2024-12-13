import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button';
import { Divider } from '../Divider';
import { Field } from '../Field';
import { Label } from '../Label';
import { Suggestion } from './';
export default {
  title: 'Komponenter/Suggestion',
  component: Suggestion,
  /* add height by default */
  decorators: [
    (Story) => (
      <div style={{ height: '600px' }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

const DATA_PLACES = [
  'Sogndal',
  'Oslo',
  'Stavanger',
  'Brønnøysund',
  'Trondheim',
  'Bergen',
];

export const Preview: StoryFn<typeof Suggestion> = (args) => {
  return (
    <Field>
      <Label>Velg en destinasjon</Label>
      <Suggestion {...args}>
        <Suggestion.Input />
        <Suggestion.Clear />
        <Suggestion.List>
          <Suggestion.Empty>Tomt</Suggestion.Empty>
          {DATA_PLACES.map((place) => (
            <Suggestion.Option key={place} value={place}>
              {place}
              <div>Kommune</div>
            </Suggestion.Option>
          ))}
        </Suggestion.List>
      </Suggestion>
    </Field>
  );
};

export const Controlled: StoryFn<typeof Suggestion> = (args) => {
  const [value, setValue] = useState('');

  console.log('controlled value is ', value);

  return (
    <>
      <Field>
        <Label>Velg en destinasjon</Label>
        <Suggestion
          {...args}
          value={value}
          onChange={(value) => {
            console.log('onChange', value);
            setValue(value);
          }}
        >
          <Suggestion.Input />
          <Suggestion.Clear />
          <Suggestion.List>
            <Suggestion.Empty>Tomt</Suggestion.Empty>
            {DATA_PLACES.map((place) => (
              <Suggestion.Option key={place}>{place}</Suggestion.Option>
            ))}
          </Suggestion.List>
        </Suggestion>
      </Field>

      <Divider style={{ marginTop: 'var(--ds-spacing-4)' }} />

      <Button
        onClick={() => {
          setValue('Sogndal');
        }}
      >
        Sett verdi til Sogndal
      </Button>
    </>
  );
};
