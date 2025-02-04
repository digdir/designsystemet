import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import { type ChangeEvent, useState } from 'react';
import { EXPERIMENTAL_MultiSelect as MultiSelect } from '.';
import { Field, Label, Spinner } from '..';
import { useDebounceCallback } from '../../utilities';

export default {
  title: 'Komponenter/MultiSelect',
  component: MultiSelect,
  /* add height by default */
  decorators: [
    (Story) => (
      <div style={{ minHeight: '300px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    a11y: {
      // TODO: these rules should be enabled after figuring out why they occur.
      // for some reason it says `aria-expanded` is not allowed
      config: {
        rules: [
          {
            id: 'aria-allowed-attr',
            enabled: false,
          },
          /* It does not like role="combobox" either */
          {
            id: 'aria-allowed-role',
            enabled: false,
          },
        ],
      },
    },
  },
  play: async (ctx) => {
    const storyRoot = ctx.canvasElement;
    // Refactored out the play function for easier reuse in the InModal story
    await testMultiSelect(storyRoot);
  },
} as Meta;

async function testMultiSelect(el: HTMLElement) {
  /* When in test mode, open MultiSelect by focusing input */
  const input = within(el).getByRole('combobox');
  await userEvent.click(input);
}

const DATA_PLACES = [
  'Sogndal',
  'Oslo',
  'Stavanger',
  'Brønnøysund',
  'Trondheim',
  'Bergen',
];

export const Preview: StoryFn<typeof MultiSelect> = (args) => {
  return (
    <Field>
      <Label>Velg reisemål du vil besøke</Label>
      <MultiSelect {...args}>
        <MultiSelect.Chips />
        <MultiSelect.Input />
        <MultiSelect.Clear />
        <MultiSelect.List>
          <MultiSelect.Empty>Tomt</MultiSelect.Empty>
          {DATA_PLACES.map((place) => (
            <MultiSelect.Option key={place} value={place}>
              {place}
              <div>Kommune</div>
            </MultiSelect.Option>
          ))}
        </MultiSelect.List>
      </MultiSelect>
    </Field>
  );
};

export const DefaultValue: StoryFn<typeof MultiSelect> = (args) => {
  return (
    <Field>
      <Label>Velg en destinasjon</Label>
      <MultiSelect {...args}>
        <MultiSelect.Chips />
        <MultiSelect.Input defaultValue='Sogndal' />
        <MultiSelect.Clear />
        <MultiSelect.List>
          <MultiSelect.Empty>Tomt</MultiSelect.Empty>
          {DATA_PLACES.map((place) => (
            <MultiSelect.Option key={place}>{place}</MultiSelect.Option>
          ))}
        </MultiSelect.List>
      </MultiSelect>
    </Field>
  );
};

export const CustomFilterAlt1: StoryFn<typeof MultiSelect> = (args) => {
  return (
    <Field>
      <Label>Skriv inn et tall mellom 1-6</Label>
      <MultiSelect
        {...args}
        filter={({ index, input }) =>
          !input.value || index === Number(input.value) - 1
        }
      >
        <MultiSelect.Chips />
        <MultiSelect.Input />
        <MultiSelect.Clear />
        <MultiSelect.List>
          <MultiSelect.Empty>Tomt</MultiSelect.Empty>
          {DATA_PLACES.map((text) => (
            <MultiSelect.Option key={text}>{text}</MultiSelect.Option>
          ))}
        </MultiSelect.List>
      </MultiSelect>
    </Field>
  );
};

export const CustomFilterAlt2: StoryFn<typeof MultiSelect> = (args) => {
  const [value, setValue] = useState('');

  return (
    <Field>
      <Label>Skriv inn et tall mellom 1-6</Label>
      <MultiSelect {...args} filter={false}>
        <MultiSelect.Chips />
        <MultiSelect.Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <MultiSelect.Clear />
        <MultiSelect.List>
          <MultiSelect.Empty>Tomt</MultiSelect.Empty>
          {DATA_PLACES.filter(
            (_, index) => !value || index === Number(value) - 1,
          ).map((text) => (
            <MultiSelect.Option key={text}>{text}</MultiSelect.Option>
          ))}
        </MultiSelect.List>
      </MultiSelect>
    </Field>
  );
};

export const AlwaysShowAll: StoryFn<typeof MultiSelect> = (args) => {
  const [value, setValue] = useState('Sogndal');

  return (
    <Field>
      <Label>Viser alle options også når valgt</Label>
      <MultiSelect {...args} filter={false}>
        <MultiSelect.Chips />
        <MultiSelect.Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <MultiSelect.Clear />
        <MultiSelect.List>
          <MultiSelect.Empty>Tomt</MultiSelect.Empty>
          {DATA_PLACES.map((place) => (
            <MultiSelect.Option key={place}>{place}</MultiSelect.Option>
          ))}
        </MultiSelect.List>
      </MultiSelect>
    </Field>
  );
};

export const FetchExternal: StoryFn<typeof MultiSelect> = (args) => {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<string[] | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isTyping = (event.nativeEvent as InputEvent).inputType;
    const value = encodeURIComponent(event.target.value.trim());
    setValue(event.target.value);

    if (!isTyping) return; // Prevent API call if clicking on items in list
    setOptions(null); // Clear options

    if (!value) return;

    debounced(value);
  };

  const apiCall = async (value: string) => {
    const api = `https://restcountries.com/v2/name/${value}?fields=name`;
    const countries = await (await fetch(api)).json();
    setOptions(
      Array.isArray(countries) ? countries.map(({ name }) => name) : [],
    );
  };

  const debounced = useDebounceCallback(apiCall, 500);

  return (
    <Field lang='en'>
      <Label>Search for countries (in english)</Label>
      <MultiSelect {...args} filter={false}>
        <MultiSelect.Chips />
        <MultiSelect.Input value={value} onChange={handleChange} />
        <MultiSelect.Clear />
        <MultiSelect.List singular='%d country' plural='%d countries'>
          {!!value && (
            <MultiSelect.Empty>
              {options ? (
                'Ingen treff'
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Spinner aria-hidden='true' data-size='sm' /> Laster...
                </span>
              )}
            </MultiSelect.Empty>
          )}
          {options?.map((option) => (
            <MultiSelect.Option key={option}>{option}</MultiSelect.Option>
          ))}
        </MultiSelect.List>
      </MultiSelect>
    </Field>
  );
};
