import { suggestion } from '@digdir/designsystemet-react';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import preview from '../../../../../apps/storybook/.storybook/preview';
import { useDebounceCallback } from '../../utilities';
import {
  Button,
  Details,
  Divider,
  Field,
  Label,
  Paragraph,
  Spinner,
} from '../';
import type { SuggestionProps } from './';
import { EXPERIMENTAL_Suggestion as Suggestion } from './';

const meta = preview.meta({
  title: 'Komponenter/Suggestion',
  component: Suggestion,
  /* add height by default */
  decorators: [
    (Story) => (
      <div style={{ minHeight: '300px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    chromatic: {
      disableSnapshot: false,
    },
    a11y: {
      config: {
        rules: [
          {
            // TODO: this rule should be enabled after https://github.com/dequelabs/axe-core/issues/4672 have propagated to @storybook/addon-a11y.
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
});

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

const DATA_PEOPLE = [
  { label: 'Lars', value: '#004' },
  { label: 'James', value: '#007' },
  { label: 'Nina', value: '#113' },
  { label: 'Tove', value: '#110' },
];

export const Preview = meta.story({
  render: (args) => {
    const [selected, setSelected] = useState(suggestion(null));

    return (
      <Field>
        <Label>Velg en destinasjon</Label>
        <Suggestion
          {...args}
          oncomboboxbeforeselect={(e) =>
            setSelected((prev) => suggestion(prev, e))
          }
        >
          {suggestion(selected, ({ label, value }) => (
            <data key={value} value={value}>
              {label}
            </data>
          ))}
          <Suggestion.Input />
          <Suggestion.Toggle />
          <Suggestion.Clear />
          <Suggestion.List id='123'>
            <Suggestion.Option data-empty />
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
  },
});

export const ControlledSingle = meta.story({
  render: (args) => {
    const [selected, setSelected] = useState(suggestion(''));

    return (
      <>
        <Field>
          <Label>Velg destinasjon</Label>
          <Suggestion
            {...args}
            oncomboboxbeforeselect={(e) =>
              setSelected((prev) => suggestion(prev, e))
            }
          >
            {suggestion(selected, ({ label, value }) => (
              <data key={value} value={value}>
                {label}
              </data>
            ))}
            <Suggestion.Input />
            <Suggestion.Toggle />
            <Suggestion.Clear />
            <Suggestion.List>
              <Suggestion.Option data-empty />
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
          Valgte reisemål: {suggestion(selected, ({ label }) => label)}
        </Paragraph>

        <Button
          onClick={() => {
            setSelected(suggestion('Sogndal'));
          }}
        >
          Sett reisemål til Sogndal
        </Button>
      </>
    );
  },

  play: async ({ canvasElement, step }) => {
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
  },
});

export const ControlledCreatable = meta.story({
  render: (args) => {
    const [selected, setSelected] = useState(suggestion(''));

    return (
      <>
        <Field>
          <Label>Velg destinasjon</Label>
          <Suggestion
            {...args}
            data-creatable
            oncomboboxbeforeselect={(e) =>
              setSelected((prev) => suggestion(prev, e))
            }
          >
            {suggestion(selected, ({ label, value }) => (
              <data key={value} value={value}>
                {label}
              </data>
            ))}
            <Suggestion.Input />
            <Suggestion.Toggle />
            <Suggestion.Clear />
            <Suggestion.List>
              <Suggestion.Option data-empty />
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
          Valgte reisemål: {suggestion(selected, ({ label }) => label)}
        </Paragraph>

        <Button
          onClick={() => {
            setSelected(suggestion('Sogndal'));
          }}
        >
          Sett reisemål til Sogndal
        </Button>
      </>
    );
  },
});

export const ControlledMultiple = meta.story({
  render: (args) => {
    const [selected, setSelected] = useState(suggestion(['Oslo']));

    return (
      <>
        <Field>
          <Label>Velg destinasjoner</Label>
          <Suggestion
            {...args}
            data-multiple
            oncomboboxbeforeselect={(e) =>
              setSelected((prev) => suggestion(prev, e))
            }
          >
            {suggestion(selected, ({ label, value }) => (
              <data key={value} value={value}>
                {label}
              </data>
            ))}
            <Suggestion.Input />
            <Suggestion.Toggle />
            <Suggestion.Clear />
            <Suggestion.List>
              <Suggestion.Option data-empty />
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
          Valgte reisemål:{' '}
          {suggestion(selected, ({ label }) => label).join(', ')}
        </Paragraph>

        <Button
          onClick={() => {
            setSelected(suggestion(['Sogndal', 'Stavanger']));
          }}
        >
          Sett reisemål til Sogndal, Stavanger
        </Button>
      </>
    );
  },

  play: async ({ canvasElement, step }) => {
    const getChipValues = async () =>
      waitFor(() =>
        within(canvasElement)
          .getAllByRole('option')
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
  },
});

export const ControlledIndependentLabelValue = meta.story({
  render: (args) => {
    const [selected, setSelected] = useState(suggestion(DATA_PEOPLE[0]));

    return (
      <>
        <Field>
          <Label>Velg person</Label>
          <Suggestion
            {...args}
            oncomboboxbeforeselect={(e) =>
              setSelected((prev) => suggestion(prev, e))
            }
          >
            {suggestion(selected, ({ label, value }) => (
              <data key={value} value={value}>
                {label}
              </data>
            ))}
            <Suggestion.Input />
            <Suggestion.Toggle />
            <Suggestion.Clear />
            <Suggestion.List>
              <Suggestion.Option data-empty />
              {DATA_PEOPLE.map(({ label, value }) => (
                <Suggestion.Option key={value} label={label} value={value}>
                  {label}
                </Suggestion.Option>
              ))}
            </Suggestion.List>
          </Suggestion>
        </Field>
        <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

        <div style={{ margin: 'var(--ds-size-2) 0' }}>
          Valgt person:
          <pre
            style={{
              fontSize: 14,
              height: 100,
              whiteSpace: 'pre-wrap',
            }}
          >
            {JSON.stringify(selected)}
          </pre>
        </div>

        <Button onClick={() => setSelected(suggestion(DATA_PEOPLE[2]))}>
          Sett Nina
        </Button>
      </>
    );
  },
});

export const ControlledIndependentLabelValueMultiple = meta.story({
  render: (args) => {
    const [selected, setSelected] = useState(suggestion([DATA_PEOPLE[0]]));

    return (
      <>
        <Field>
          <Label>Velg person</Label>
          <Suggestion
            {...args}
            data-multiple
            oncomboboxbeforeselect={(e) =>
              setSelected((prev) => suggestion(prev, e))
            }
          >
            {suggestion(selected, ({ label, value }) => (
              <data key={value} value={value}>
                {label}
              </data>
            ))}
            <Suggestion.Input />
            <Suggestion.Toggle />
            <Suggestion.Clear />
            <Suggestion.List>
              <Suggestion.Option data-empty />
              {DATA_PEOPLE.map(({ label, value }) => (
                <Suggestion.Option key={value} label={label} value={value}>
                  {label}
                </Suggestion.Option>
              ))}
            </Suggestion.List>
          </Suggestion>
        </Field>
        <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

        <div style={{ margin: 'var(--ds-size-2) 0' }}>
          Valgt person:
          <pre
            style={{
              fontSize: 14,
              height: 100,
              whiteSpace: 'pre-wrap',
            }}
          >
            {JSON.stringify(selected)}
          </pre>
        </div>

        <Button onClick={() => setSelected(suggestion([DATA_PEOPLE[2]]))}>
          Sett Nina
        </Button>
      </>
    );
  },
});

export const CustomFilter = meta.story({
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <Field>
        <Label>Skriv inn et tall mellom 1-6</Label>
        <Suggestion {...args}>
          <Suggestion.Input onInput={(e) => setValue(e.currentTarget.value)} />
          <Suggestion.Toggle />
          <Suggestion.Clear />
          <Suggestion.List data-nofilter>
            <Suggestion.Option data-empty />
            {DATA_PLACES.filter((_, index) => {
              return !value || index === Number(value) - 1;
            }).map((label) => (
              <Suggestion.Option key={label} value={label.toLowerCase()}>
                {label}
              </Suggestion.Option>
            ))}
          </Suggestion.List>
        </Suggestion>
      </Field>
    );
  },
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
});

export const CustomMatching = meta.story({
  render: (args) => {
    const handleBeforeMatch: SuggestionProps['oncomboboxbeforematch'] = (e) => {
      e.preventDefault(); // Prevent default matching
      const { list, control } = e.currentTarget;
      const value = control?.value.toLowerCase() || '';

      for (const option of list?.options || [])
        option.selected = option.value.toLowerCase().startsWith(value); // Setting selected indicates a match
    };

    return (
      <Field>
        <Label>Matcher fra første bokstav</Label>
        <Field.Description>
          Prøv å skriv <strong>t</strong> og trykk Enter
        </Field.Description>
        <Suggestion {...args} oncomboboxbeforematch={handleBeforeMatch}>
          <Suggestion.Input />
          <Suggestion.Toggle />
          <Suggestion.Clear />
          <Suggestion.List>
            <Suggestion.Option data-empty />
            {DATA_PLACES.map((label) => (
              <Suggestion.Option key={label}>{label}</Suggestion.Option>
            ))}
          </Suggestion.List>
        </Suggestion>
      </Field>
    );
  },
});

export const AlwaysShowAll = meta.story({
  render: (args) => {
    const [selected, setSelected] = useState(suggestion('Sogndal'));

    return (
      <Field>
        <Label>Viser alle options også når valgt</Label>
        <Suggestion
          {...args}
          oncomboboxbeforeselect={(e) =>
            setSelected((prev) => suggestion(prev, e))
          }
        >
          {suggestion(selected, ({ label, value }) => (
            <data key={value} value={value}>
              {label}
            </data>
          ))}
          <Suggestion.Input />
          <Suggestion.Toggle />
          <Suggestion.Clear />
          <Suggestion.List data-nofilter>
            <Suggestion.Option data-empty />
            {DATA_PLACES.map((place) => (
              <Suggestion.Option key={place}>{place}</Suggestion.Option>
            ))}
          </Suggestion.List>
        </Suggestion>
      </Field>
    );
  },
});

export const FetchExternal = meta.story({
  render: (args) => {
    const [value, setValue] = useState('');
    const [options, setOptions] = useState<string[] | null>(null);

    const handleInput: React.InputEventHandler<HTMLInputElement> = (event) => {
      console.log(event);
      const value = encodeURIComponent(event.currentTarget.value.trim());
      setValue(event.currentTarget.value);
      setOptions(null); // Clear options
      if (value) debounced(value);
    };

    const apiCall = async (value: string) => {
      const api = `https://dummyjson.com/recipes/search?q=${value}`;
      const data = await (await fetch(api)).json();
      setOptions(data.recipes.map(({ name }: Record<string, string>) => name));
    };

    const debounced = useDebounceCallback(apiCall, 500);

    return (
      <Field lang='en'>
        <Label>Search for a recipe (in english)</Label>
        <Suggestion
          {...args}
          style={
            {
              '--sr-plural': '%d country',
              '--sr-singular': '%d countries',
            } as React.CSSProperties
          }
        >
          <Suggestion.Input type='search' onInput={handleInput} />
          <Suggestion.Toggle />
          <Suggestion.Clear />
          <Suggestion.List data-nofilter>
            {value ? (
              <Suggestion.Option data-empty>
                {options ? (
                  'Ingen treff'
                ) : (
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Spinner aria-hidden='true' data-size='sm' /> Laster...
                  </span>
                )}
              </Suggestion.Option>
            ) : null}
            {options?.map((option) => (
              <Suggestion.Option key={option}>{option}</Suggestion.Option>
            ))}
          </Suggestion.List>
        </Suggestion>
      </Field>
    );
  },
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
});

export const Multiple = meta.story({
  render: (args) => {
    return (
      <Field>
        <Label>Velg en destinasjon</Label>
        <Suggestion {...args} data-multiple>
          <Suggestion.Input />
          <Suggestion.Toggle />
          <Suggestion.Clear />
          <Suggestion.List>
            <Suggestion.Option data-empty />
            {DATA_PLACES.map((place) => (
              <Suggestion.Option key={place}>{place}</Suggestion.Option>
            ))}
          </Suggestion.List>
        </Suggestion>
      </Field>
    );
  },
});

export const InDetails = meta.story({
  render: (args) => {
    return (
      <Details>
        <Details.Summary>Åpne details som har overflow: clip;</Details.Summary>
        <Details.Content>
          <Field>
            <Label>Velg en destinasjon</Label>
            <Suggestion {...args}>
              <Suggestion.Input autoFocus />
              <Suggestion.Toggle />
              <Suggestion.Clear />
              <Suggestion.List>
                <Suggestion.Option data-empty />
                {DATA_PLACES.map((place) => (
                  <Suggestion.Option key={place}>{place}</Suggestion.Option>
                ))}
              </Suggestion.List>
            </Suggestion>
          </Field>
        </Details.Content>
      </Details>
    );
  },
});

export const AutoPlacementOnXAxis = meta.story({
  render: (args) => {
    return (
      <div style={{ paddingTop: '700px' }}>
        <Field>
          <Label>Velg en destinasjon</Label>
          <Suggestion {...args} autoFocus>
            <Suggestion.Input />
            <Suggestion.Toggle />
            <Suggestion.Clear />
            <Suggestion.List>
              <Suggestion.Option data-empty />
              {DATA_PLACES.map((place) => (
                <Suggestion.Option key={place}>{place}</Suggestion.Option>
              ))}
            </Suggestion.List>
          </Suggestion>
        </Field>
      </div>
    );
  },
});

export const Creatable = meta.story({
  render: (args) => {
    return (
      <Field>
        <Label>Velg eller legg til en destinasjon</Label>
        <Suggestion {...args} data-multiple data-creatable>
          <Suggestion.Input />
          <Suggestion.Toggle />
          <Suggestion.Clear />
          <Suggestion.List>
            <Suggestion.Option data-empty />
            {DATA_PLACES.map((place) => (
              <Suggestion.Option key={place}>{place}</Suggestion.Option>
            ))}
          </Suggestion.List>
        </Suggestion>
      </Field>
    );
  },
});

export const WithoutToggleButton = meta.story({
  render: (args) => {
    return (
      <Field>
        <Label>Velg eller legg til en destinasjon</Label>
        <Suggestion {...args} data-multiple>
          <Suggestion.Input />
          <Suggestion.Clear />
          <Suggestion.List>
            <Suggestion.Option data-empty />
            {DATA_PLACES.map((place) => (
              <Suggestion.Option key={place}>{place}</Suggestion.Option>
            ))}
          </Suggestion.List>
        </Suggestion>
      </Field>
    );
  },
});
