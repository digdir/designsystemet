import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import { type ChangeEvent, useRef, useState } from 'react';
import { Button, Divider, Field, Label, Paragraph, Spinner } from '../';
import { EXPERIMENTAL_Suggestion as Suggestion } from './';

export default {
  title: 'Komponenter/Suggestion',
  component: Suggestion,
  /* add height by default */
  decorators: [
    (Story) => (
      <div style={{ height: '300px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    customStyles: {
      overflow: 'visible', // Show dropdown outside of container
    },
    a11y: {
      // TODO: these rules should be enabled after figuring out why they occur.
      // for some reason it says `aria-expanded` is not allowed
      config: {
        rules: [
          {
            id: 'aria-allowed-attr',
            enabled: false,
          },
        ],
      },
    },
  },
  play: async (ctx) => {
    const storyRoot = ctx.canvasElement;
    // Refactored out the play function for easier reuse in the InModal story
    await testSuggestion(storyRoot);
  },
} as Meta;

async function testSuggestion(el: HTMLElement) {
  /* When in test mode, open suggestion by focusing input */
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

  return (
    <>
      <Field>
        <Label>Velg en destinasjon</Label>
        <Suggestion {...args}>
          <Suggestion.Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
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

      <Paragraph style={{ margin: 'var(--ds-spacing-2) 0' }}>
        Du har skrevet inn: {value}
      </Paragraph>

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

export const DefaultValue: StoryFn<typeof Suggestion> = (args) => {
  return (
    <Field>
      <Label>Velg en destinasjon</Label>
      <Suggestion {...args}>
        <Suggestion.Input defaultValue='Sogndal' />
        <Suggestion.Clear />
        <Suggestion.List>
          <Suggestion.Empty>Tomt</Suggestion.Empty>
          {DATA_PLACES.map((place) => (
            <Suggestion.Option key={place}>{place}</Suggestion.Option>
          ))}
        </Suggestion.List>
      </Suggestion>
    </Field>
  );
};

export const CustomFilter: StoryFn<typeof Suggestion> = (args) => {
  const [value, setValue] = useState('');

  return (
    <Field>
      <Label>Skriv inn et tall mellom 1-6</Label>
      <Suggestion {...args}>
        <Suggestion.Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Suggestion.Clear />
        <Suggestion.List>
          <Suggestion.Empty>Tomt</Suggestion.Empty>
          {DATA_PLACES.filter(
            (_, index) => !value || index === Number(value) - 1,
          ).map((text) => (
            // Setting label ensures that item is always displayed regardless of input.value
            <Suggestion.Option label={value} key={text}>
              {text}
            </Suggestion.Option>
          ))}
        </Suggestion.List>
      </Suggestion>
    </Field>
  );
};

export const AlwaysShowAll: StoryFn<typeof Suggestion> = (args) => {
  const [value, setValue] = useState('Sogndal');

  return (
    <Field>
      <Label>Viser alle options også når valgt</Label>
      <Suggestion {...args}>
        <Suggestion.Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Suggestion.Clear />
        <Suggestion.List>
          <Suggestion.Empty>Tomt</Suggestion.Empty>
          {DATA_PLACES.map((place) => (
            // Setting label ensures that item is always displayed regardless of input.value
            <Suggestion.Option label={value} key={place}>
              {place}
            </Suggestion.Option>
          ))}
        </Suggestion.List>
      </Suggestion>
    </Field>
  );
};

export const FetchExternal: StoryFn<typeof Suggestion> = (args) => {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<string[] | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout>>(); // Debounce so we do not spam the endpoint

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isTyping = (event.nativeEvent as InputEvent).inputType;
    const value = encodeURIComponent(event.target.value.trim());
    clearTimeout(debounce.current);
    setValue(event.target.value);

    if (!isTyping) return; // Prevent API call if clicking on items in list
    setOptions(null); // Clear options

    if (value)
      debounce.current = setTimeout(async () => {
        const api = `https://restcountries.com/v2/name/${value}?fields=name`;
        const countries = await (await fetch(api)).json();
        setOptions(
          Array.isArray(countries) ? countries.map(({ name }) => name) : [],
        );
      }, 500);
  };

  return (
    <Field>
      <Label>Søk etter land (på engelsk)</Label>
      <Suggestion {...args}>
        <Suggestion.Input value={value} onChange={handleChange} />
        <Suggestion.Clear />
        <Suggestion.List>
          {!!value && (
            <Suggestion.Empty aria-busy='true'>
              {options ? 'Ingen treff' : <Spinner aria-label='Laster...' />}
            </Suggestion.Empty>
          )}
          {options?.map((option) => (
            // Setting label ensures that item is always displayed regardless of input.value
            <Suggestion.Option label={value} key={option}>
              {option}
            </Suggestion.Option>
          ))}
        </Suggestion.List>
      </Suggestion>
    </Field>
  );
};
