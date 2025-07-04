import type { Meta, StoryFn } from '@storybook/react-vite';
import { type ChangeEvent, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { useDebounceCallback } from '../../utilities';
import { Button, Divider, Field, Label, Paragraph, Spinner } from '..';
import {
  EXPERIMENTAL_Suggestion as Suggestion,
  type SuggestionValues,
} from '.';

export default {
  title: 'Komponenter/Suggestion',
  component: Suggestion,
  /* add height by default */
  decorators: [
    (Story) => (
      <div style={{ minHeight: '500px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    chromatic: {
      disableSnapshot: false,
    },
    a11y: {
      // TODO: this rule should be enabled after https://github.com/dequelabs/axe-core/issues/4672 have propagated to @storybook/addon-a11y.
      config: {
        rules: [
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
    await testSuggestion(storyRoot);
  },
} as Meta;

async function testSuggestion(el: HTMLElement) {
  /* wait for role to be added */
  const input = await waitFor(() => within(el).getByRole('combobox'));
  /* When in test mode, open suggestion by focusing input */
  await userEvent.click(input);
}

const DATA_PLACES = [
  'Sogndal',
  'Oslo',
  'Brønnøysund',
  'Stavanger',
  'Trondheim',
  'Bergen',
  'Lillestrøm',
];

export const Preview: StoryFn<typeof Suggestion> = (args) => {
  return (
    <Field>
      <Label>Velg en destinasjon</Label>
      <Suggestion {...args}>
        <Suggestion.Chips />
        <Suggestion.Input />
        <Suggestion.Clear />
        <Suggestion.List>
          <Suggestion.Empty>Tomt</Suggestion.Empty>
          {DATA_PLACES.map((place) => (
            <Suggestion.Option key={place} label={place} value={place}>
              {place}
              <div>Kommune</div>
            </Suggestion.Option>
          ))}
        </Suggestion.List>
      </Suggestion>
    </Field>
  );
};

export const ControlledSingleArray: StoryFn<typeof Suggestion> = (args) => {
  const [value, setValue] = useState<string[]>(['Oslo']);

  return (
    <>
      <Field>
        <Label>Velg destinasjon</Label>
        <Suggestion
          {...args}
          value={value}
          onValueChange={(items) => setValue(items.map((item) => item.value))}
        >
          <Suggestion.Chips />
          <Suggestion.Input />
          <Suggestion.Clear />
          <Suggestion.List>
            <Suggestion.Empty>Tomt</Suggestion.Empty>
            {DATA_PLACES.map((place) => (
              <Suggestion.Option key={place} label={place} value={place}>
                {place}
                <div>Kommune</div>
              </Suggestion.Option>
            ))}
          </Suggestion.List>
        </Suggestion>
      </Field>
      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

      <Paragraph style={{ margin: 'var(--ds-size-2) 0' }}>
        Valgte reisemål: {value.join(', ')}
      </Paragraph>

      <Button
        onClick={() => {
          setValue(['Sogndal']);
        }}
      >
        Sett reisemål til Sogndal
      </Button>
    </>
  );
};
ControlledSingleArray.play = async ({ canvasElement, step }) => {
  const input = await waitFor(() =>
    within(canvasElement).getByRole('combobox'),
  );
  const resultText = within(canvasElement).getByText('Valgte reisemål:', {
    exact: false,
  });
  const button = within(canvasElement).getByText('Sett reisemål', {
    exact: false,
    selector: 'button',
  });

  await step('Initial state is rendered correctly', async () => {
    await expect(resultText).toHaveTextContent('Oslo');
    await waitFor(() => expect(input).toHaveValue('Oslo'));
  });

  await step('Controlled state change renders correctly', async () => {
    await userEvent.click(button);
    await expect(resultText).toHaveTextContent('Sogndal');
    await waitFor(() => expect(input).toHaveValue('Sogndal'));
  });
};

export const ControlledSingle: StoryFn<typeof Suggestion> = (args) => {
  const [value, setValue] = useState<string>('');

  return (
    <>
      <Field>
        <Label>Velg destinasjon</Label>
        <Suggestion
          {...args}
          value={value}
          onValueChange={(items) => setValue(items.at(0)?.value ?? '')}
        >
          <Suggestion.Chips />
          <Suggestion.Input />
          <Suggestion.Clear />
          <Suggestion.List>
            <Suggestion.Empty>Tomt</Suggestion.Empty>
            {DATA_PLACES.map((place) => (
              <Suggestion.Option key={place} label={place} value={place}>
                {place}
                <div>Kommune</div>
              </Suggestion.Option>
            ))}
          </Suggestion.List>
        </Suggestion>
      </Field>
      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

      <Paragraph style={{ margin: 'var(--ds-size-2) 0' }}>
        Valgte reisemål: {value}
      </Paragraph>

      <Button
        onClick={() => {
          setValue('Sogndal');
        }}
      >
        Sett reisemål til Sogndal
      </Button>
    </>
  );
};
ControlledSingle.play = async ({ canvasElement, step }) => {
  const input = await waitFor(() =>
    within(canvasElement).getByRole('combobox'),
  );
  const resultText = within(canvasElement).getByText('Valgte reisemål:', {
    exact: false,
  });
  const button = within(canvasElement).getByText('Sett reisemål', {
    exact: false,
    selector: 'button',
  });

  await step('Initial state is empty', async () => {
    await expect(resultText).toHaveTextContent(/^Valgte reisemål:$/);
    await waitFor(() => expect(input).toHaveValue(''));
  });

  await step('Controlled state change renders correctly', async () => {
    await userEvent.click(button);
    await expect(resultText).toHaveTextContent('Sogndal');
    await waitFor(() => expect(input).toHaveValue('Sogndal'));
  });
};

export const ControlledMultiple: StoryFn<typeof Suggestion> = (args) => {
  const [value, setValue] = useState<string[]>(['Oslo']);

  return (
    <>
      <Field>
        <Label>Velg destinasjoner</Label>
        <Suggestion
          {...args}
          multiple
          value={value}
          onValueChange={(items) => setValue(items.map((item) => item.value))}
        >
          <Suggestion.Chips />
          <Suggestion.Input />
          <Suggestion.Clear />
          <Suggestion.List>
            <Suggestion.Empty>Tomt</Suggestion.Empty>
            {DATA_PLACES.map((place) => (
              <Suggestion.Option key={place} label={place} value={place}>
                {place}
                <div>Kommune</div>
              </Suggestion.Option>
            ))}
          </Suggestion.List>
        </Suggestion>
      </Field>
      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

      <Paragraph style={{ margin: 'var(--ds-size-2) 0' }}>
        Valgte reisemål: {value.join(', ')}
      </Paragraph>

      <Button
        onClick={() => {
          setValue(['Sogndal', 'Stavanger']);
        }}
      >
        Sett reisemål til Sogndal, Stavanger
      </Button>
    </>
  );
};

ControlledMultiple.play = async ({ canvasElement, step }) => {
  const getChipValues = async () =>
    waitFor(() =>
      within(canvasElement)
        .getAllByLabelText('Press to remove', { exact: false })
        .filter((el) => el instanceof HTMLDataElement)
        .map((x) => x.value),
    );
  const resultText = within(canvasElement).getByText('Valgte reisemål:', {
    exact: false,
  });
  const button = within(canvasElement).getByText('Sett reisemål', {
    exact: false,
    selector: 'button',
  });

  await step('Initial state is rendered correctly', async () => {
    await expect(resultText).toHaveTextContent('Oslo');
    await expect(await getChipValues()).toContain('Oslo');
  });

  await step('Controlled state change renders correctly', async () => {
    await userEvent.click(button);
    await expect(resultText).toHaveTextContent('Sogndal');
    await expect(resultText).toHaveTextContent('Stavanger');
    const chipValues = await getChipValues();
    await expect(chipValues).toContain('Sogndal');
    await expect(chipValues).toContain('Stavanger');
  });
};

export const CustomFilterAlt1: StoryFn<typeof Suggestion> = (args) => {
  return (
    <Field>
      <Label>Skriv inn et tall mellom 1-6</Label>
      <Suggestion
        {...args}
        filter={({ index, input }) =>
          !input.value || index === Number(input.value) - 1
        }
      >
        <Suggestion.Chips />
        <Suggestion.Input />
        <Suggestion.Clear />
        <Suggestion.List>
          <Suggestion.Empty>Tomt</Suggestion.Empty>
          {DATA_PLACES.map((label) => (
            <Suggestion.Option key={label} value={label.toLowerCase()}>
              {label}
            </Suggestion.Option>
          ))}
        </Suggestion.List>
      </Suggestion>
    </Field>
  );
};

CustomFilterAlt1.parameters = {
  docs: {
    source: {
      type: 'code',
    },
  },
};

export const CustomFilterAlt2: StoryFn<typeof Suggestion> = (args) => {
  const [value, setValue] = useState('');

  return (
    <Field>
      <Label>Skriv inn et tall mellom 1-6</Label>
      <Suggestion {...args} filter={false}>
        <Suggestion.Chips />
        <Suggestion.Input
          onInput={({ currentTarget }) => setValue(currentTarget.value)}
        />
        <Suggestion.Clear />
        <Suggestion.List>
          <Suggestion.Empty>Tomt</Suggestion.Empty>
          {DATA_PLACES.filter(
            (_, index) => !value || index === Number(value) - 1,
          ).map((label) => (
            <Suggestion.Option key={label}>{label}</Suggestion.Option>
          ))}
        </Suggestion.List>
      </Suggestion>
    </Field>
  );
};

export const AlwaysShowAll: StoryFn<typeof Suggestion> = (args) => {
  const [value, setValue] = useState<SuggestionValues>('Sogndal');

  return (
    <Field>
      <Label>Viser alle options også når valgt</Label>
      <Suggestion
        {...args}
        value={value}
        filter={false}
        onValueChange={(values) => setValue(values)}
      >
        <Suggestion.Chips />
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
  );
};

export const FetchExternal: StoryFn<typeof Suggestion> = (args) => {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<string[] | null>(null);

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = encodeURIComponent(event.target.value.trim());
    setValue(event.target.value);
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
      <Suggestion {...args} filter={false}>
        <Suggestion.Chips />
        <Suggestion.Input onInput={handleInput} />
        <Suggestion.Clear />
        <Suggestion.List singular='%d country' plural='%d countries'>
          {value ? (
            <Suggestion.Empty>
              {options ? (
                'Ingen treff'
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Spinner aria-hidden='true' data-size='sm' /> Laster...
                </span>
              )}
            </Suggestion.Empty>
          ) : null}
          {options?.map((option) => (
            <Suggestion.Option key={option}>{option}</Suggestion.Option>
          ))}
        </Suggestion.List>
      </Suggestion>
    </Field>
  );
};

FetchExternal.parameters = {
  docs: {
    source: {
      type: 'code',
    },
  },
};

export const DefaultValue: StoryFn<typeof Suggestion> = (args) => {
  return (
    <Field>
      <Label>Velg en destinasjon</Label>
      <Suggestion {...args} defaultValue={['Sogndal']}>
        <Suggestion.Chips />
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
  );
};

export const Multiple: StoryFn<typeof Suggestion> = (args) => {
  return (
    <Field>
      <Label>Velg en destinasjon</Label>
      <Suggestion {...args}>
        <Suggestion.Chips />
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
  );
};

Multiple.args = {
  multiple: true,
};
