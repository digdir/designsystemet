import {
  Button,
  Divider,
  EXPERIMENTAL_Suggestion,
  Field,
  Label,
  Paragraph,
  type SuggestionProps,
  suggestion,
} from '@digdir/designsystemet-react';
import { useRef, useState } from 'react';

export const Preview = () => {
  const DATA_PLACES = ['Sogndal', 'Oslo', 'Brønnøysund'];
  return (
    <Field>
      <Label>Velg en destinasjon</Label>
      <EXPERIMENTAL_Suggestion>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Toggle />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Option data-empty>
            Ingen treff
          </EXPERIMENTAL_Suggestion.Option>
          {DATA_PLACES.map((place) => (
            <EXPERIMENTAL_Suggestion.Option
              key={place}
              label={place}
              value={place}
            >
              {place}
              <div>Kommune</div>
            </EXPERIMENTAL_Suggestion.Option>
          ))}
        </EXPERIMENTAL_Suggestion.List>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};

export const PreviewEn = () => {
  const DATA_PLACES = ['Sogndal', 'Oslo', 'Brønnøysund'];
  return (
    <Field>
      <Label>Select a destination</Label>
      <EXPERIMENTAL_Suggestion>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Toggle />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Option data-empty>
            No results found
          </EXPERIMENTAL_Suggestion.Option>
          {DATA_PLACES.map((place) => (
            <EXPERIMENTAL_Suggestion.Option
              key={place}
              label={place}
              value={place}
            >
              {place}
              <div>Municipality</div>
            </EXPERIMENTAL_Suggestion.Option>
          ))}
        </EXPERIMENTAL_Suggestion.List>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};

export const Multiple = () => {
  const DATA_PLACES = [
    'Sogndal',
    'Oslo',
    'Brønnøysund',
    'Stavanger',
    'Trondheim',
    'Bergen',
    'Lillestrøm',
  ];
  return (
    <Field>
      <Label>Velg en destinasjon</Label>
      <EXPERIMENTAL_Suggestion data-multiple>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Toggle />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Option data-empty>
            Ingen treff
          </EXPERIMENTAL_Suggestion.Option>
          {DATA_PLACES.map((place) => (
            <EXPERIMENTAL_Suggestion.Option key={place}>
              {place}
            </EXPERIMENTAL_Suggestion.Option>
          ))}
        </EXPERIMENTAL_Suggestion.List>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};

export const MultipleEn = () => {
  const DATA_PLACES = [
    'Sogndal',
    'Oslo',
    'Brønnøysund',
    'Stavanger',
    'Trondheim',
    'Bergen',
    'Lillestrøm',
  ];
  return (
    <Field>
      <Label>Select a destination</Label>
      <EXPERIMENTAL_Suggestion data-multiple>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Toggle />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Option data-empty>
            No results found
          </EXPERIMENTAL_Suggestion.Option>
          {DATA_PLACES.map((place) => (
            <EXPERIMENTAL_Suggestion.Option key={place}>
              {place}
            </EXPERIMENTAL_Suggestion.Option>
          ))}
        </EXPERIMENTAL_Suggestion.List>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};

export const Filter = () => {
  const DATA_PLACES = [
    'Sogndal',
    'Oslo',
    'Brønnøysund',
    'Stavanger',
    'Trondheim',
    'Bergen',
    'Lillestrøm',
  ];
  const [value, setValue] = useState('');

  return (
    <Field>
      <Label>Skriv inn et tall mellom 1-7</Label>
      <EXPERIMENTAL_Suggestion>
        <EXPERIMENTAL_Suggestion.Input
          onInput={(event) => setValue(event.currentTarget.value)} // Note: using onInput, not onChange
        />
        <EXPERIMENTAL_Suggestion.Toggle />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List data-nofilter>
          <EXPERIMENTAL_Suggestion.Option data-empty>
            Ingen treff
          </EXPERIMENTAL_Suggestion.Option>
          {DATA_PLACES.filter(
            (_, index) => !value || index === Number(value) - 1,
          ).map((label) => (
            <EXPERIMENTAL_Suggestion.Option
              key={label}
              value={label.toLowerCase()}
            >
              {label}
            </EXPERIMENTAL_Suggestion.Option>
          ))}
        </EXPERIMENTAL_Suggestion.List>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};

export const ControlledMultiple = () => {
  const DATA_PLACES = [
    'Sogndal',
    'Oslo',
    'Brønnøysund',
    'Stavanger',
    'Trondheim',
    'Bergen',
    'Lillestrøm',
  ];
  const [selected, setSelected] = useState(suggestion(['Oslo']));

  return (
    <>
      <Field>
        <Label>Velg destinasjoner</Label>
        <EXPERIMENTAL_Suggestion
          data-multiple
          oncomboboxbeforeselect={(event) =>
            setSelected(suggestion(selected, event))
          }
        >
          {suggestion(selected, ({ label, value }) => (
            <data suppressHydrationWarning key={value} value={value}>
              {label}
            </data>
          ))}
          <EXPERIMENTAL_Suggestion.Input />
          <EXPERIMENTAL_Suggestion.Toggle />
          <EXPERIMENTAL_Suggestion.Clear />
          <EXPERIMENTAL_Suggestion.List>
            <EXPERIMENTAL_Suggestion.Option data-empty>
              Ingen treff
            </EXPERIMENTAL_Suggestion.Option>
            {DATA_PLACES.map((place) => (
              <EXPERIMENTAL_Suggestion.Option
                key={place}
                label={place}
                value={place}
              >
                {place}
                <div>Kommune</div>
              </EXPERIMENTAL_Suggestion.Option>
            ))}
          </EXPERIMENTAL_Suggestion.List>
        </EXPERIMENTAL_Suggestion>
      </Field>
      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

      <Paragraph style={{ margin: 'var(--ds-size-2) 0' }}>
        Valgte reisemål: {suggestion(selected, ({ label }) => label).join(', ')}
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
};

export const ControlledMultipleEn = () => {
  const DATA_PLACES = [
    'Sogndal',
    'Oslo',
    'Brønnøysund',
    'Stavanger',
    'Trondheim',
    'Bergen',
    'Lillestrøm',
  ];
  const [selected, setSelected] = useState(suggestion(['Oslo']));

  return (
    <>
      <Field>
        <Label>Select destinations</Label>
        <EXPERIMENTAL_Suggestion
          data-multiple
          oncomboboxbeforeselect={(event) =>
            setSelected(suggestion(selected, event))
          }
        >
          {suggestion(selected, ({ label, value }) => (
            <data suppressHydrationWarning key={value} value={value}>
              {label}
            </data>
          ))}
          <EXPERIMENTAL_Suggestion.Input />
          <EXPERIMENTAL_Suggestion.Toggle />
          <EXPERIMENTAL_Suggestion.Clear />
          <EXPERIMENTAL_Suggestion.List>
            <EXPERIMENTAL_Suggestion.Option data-empty>
              No results found
            </EXPERIMENTAL_Suggestion.Option>
            {DATA_PLACES.map((place) => (
              <EXPERIMENTAL_Suggestion.Option
                key={place}
                label={place}
                value={place}
              >
                {place}
                <div>Municipality</div>
              </EXPERIMENTAL_Suggestion.Option>
            ))}
          </EXPERIMENTAL_Suggestion.List>
        </EXPERIMENTAL_Suggestion>
      </Field>
      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

      <Paragraph style={{ margin: 'var(--ds-size-2) 0' }}>
        Selected destinations:{' '}
        {suggestion(selected, ({ label }) => label).join(', ')}
      </Paragraph>

      <Button
        onClick={() => {
          setSelected(suggestion(['Sogndal', 'Stavanger']));
        }}
      >
        Set destinations to Sogndal, Stavanger
      </Button>
    </>
  );
};

export const Creatable = () => {
  const DATA_PLACES = [
    'Sogndal',
    'Oslo',
    'Brønnøysund',
    'Stavanger',
    'Trondheim',
    'Bergen',
    'Lillestrøm',
  ];
  return (
    <Field>
      <Label>Velg destinasjon</Label>
      <EXPERIMENTAL_Suggestion data-creatable data-multiple>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Toggle />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Option data-empty />
          {DATA_PLACES.map((place) => (
            <EXPERIMENTAL_Suggestion.Option key={place}>
              {place}
            </EXPERIMENTAL_Suggestion.Option>
          ))}
        </EXPERIMENTAL_Suggestion.List>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};
export const CreatableEn = () => {
  const DATA_PLACES = [
    'Sogndal',
    'Oslo',
    'Brønnøysund',
    'Stavanger',
    'Trondheim',
    'Bergen',
    'Lillestrøm',
  ];
  return (
    <Field>
      <Label>Select destination</Label>
      <EXPERIMENTAL_Suggestion data-creatable data-multiple>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Toggle />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Option data-empty />
          {DATA_PLACES.map((place) => (
            <EXPERIMENTAL_Suggestion.Option key={place}>
              {place}
            </EXPERIMENTAL_Suggestion.Option>
          ))}
        </EXPERIMENTAL_Suggestion.List>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};

export const FetchExternal = () => {
  const empty = 'Search for recipes';
  const [options, setOptions] = useState<string[] | string>(empty); // Store results
  const timer = useRef<ReturnType<typeof setTimeout> | number>(0);
  const latestValue = useRef('');

  const getRecipes = async (value: string) => {
    if (!value) return setOptions(empty);
    const api = `https://dummyjson.com/recipes/search?q=${value}`;
    const data = await (await fetch(api)).json();
    if (latestValue.current !== value) return;
    setOptions(
      Array.isArray(data.recipes)
        ? data.recipes.map(({ name }: { name: string }) => name)
        : [],
    );
  };

  const handleInput = (event: React.InputEvent<HTMLInputElement>) => {
    const value = encodeURIComponent(event.currentTarget.value.trim());
    latestValue.current = value;
    setOptions(value ? 'Loading...' : empty);
    clearTimeout(timer.current);
    timer.current = setTimeout(getRecipes, 500, value); // Debounce API call
  };

  return (
    <Field lang='en'>
      <Label>Search for recipes (in English)</Label>
      <EXPERIMENTAL_Suggestion>
        <EXPERIMENTAL_Suggestion.Input
          type='search'
          onInput={handleInput} // Note: using onInput, not onChange
        />
        <EXPERIMENTAL_Suggestion.Toggle />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List data-nofilter>
          {Array.isArray(options) ? (
            options.map((option) => (
              <EXPERIMENTAL_Suggestion.Option key={option}>
                {option}
              </EXPERIMENTAL_Suggestion.Option>
            ))
          ) : (
            <EXPERIMENTAL_Suggestion.Option data-empty>
              {options}
            </EXPERIMENTAL_Suggestion.Option>
          )}
        </EXPERIMENTAL_Suggestion.List>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};

export const ClickToNavigate = () => {
  const handleSelect: SuggestionProps['oncomboboxbeforeselect'] = (event) => {
    const href = suggestion(null, event)?.value; // Also prevents rendering the selected item
    if (href) window.location.href = href;
  };

  return (
    <Field>
      <Label>Klikk for å navigere</Label>
      <EXPERIMENTAL_Suggestion oncomboboxbeforeselect={handleSelect}>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Toggle />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Option value='https://www.designsystemet.no/'>
            Designsystemet
          </EXPERIMENTAL_Suggestion.Option>
          <EXPERIMENTAL_Suggestion.Option value='https://www.digdir.no/'>
            Digdir
          </EXPERIMENTAL_Suggestion.Option>
          <EXPERIMENTAL_Suggestion.Option value='https://www.uutilsynet.no/'>
            UU-tilsynet
          </EXPERIMENTAL_Suggestion.Option>
        </EXPERIMENTAL_Suggestion.List>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};

export const ClickToNavigateEn = () => {
  const handleSelect: SuggestionProps['oncomboboxbeforeselect'] = (event) => {
    const href = suggestion(null, event)?.value; // Also prevents rendering the selected item
    if (href) window.location.href = href;
  };

  return (
    <Field>
      <Label>Click to navigate</Label>
      <EXPERIMENTAL_Suggestion oncomboboxbeforeselect={handleSelect}>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Toggle />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Option value='https://www.designsystemet.no/'>
            Designsystemet
          </EXPERIMENTAL_Suggestion.Option>
          <EXPERIMENTAL_Suggestion.Option value='https://www.digdir.no/'>
            Digdir
          </EXPERIMENTAL_Suggestion.Option>
          <EXPERIMENTAL_Suggestion.Option value='https://www.uutilsynet.no/'>
            UU-tilsynet
          </EXPERIMENTAL_Suggestion.Option>
        </EXPERIMENTAL_Suggestion.List>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};

export const EmailSuggestions = () => {
  const [options, setOptions] = useState<string[]>([]); // Store results
  const vendora = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];

  const handleInput = (event: React.InputEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value.trim();
    const name = value.split('@')[0];
    setOptions(value ? vendora.map((vendor) => `${name}@${vendor}`) : []);
  };

  return (
    <Field>
      <Label>Fyll inn din e-post</Label>
      <EXPERIMENTAL_Suggestion data-creatable>
        <EXPERIMENTAL_Suggestion.Input
          onInput={handleInput} // Note: using onInput, not onChange
        />
        <EXPERIMENTAL_Suggestion.Toggle />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Option data-empty />
          {options.map((option) => (
            <EXPERIMENTAL_Suggestion.Option key={option} value={option}>
              {option}
            </EXPERIMENTAL_Suggestion.Option>
          ))}
        </EXPERIMENTAL_Suggestion.List>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};

export const EmailSuggestionsEn = () => {
  const [options, setOptions] = useState<string[]>([]); // Store results
  const vendora = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];

  const handleInput = (event: React.InputEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value.trim();
    const name = value.split('@')[0];
    setOptions(value ? vendora.map((vendor) => `${name}@${vendor}`) : []);
  };

  return (
    <Field>
      <Label>Enter your email</Label>
      <EXPERIMENTAL_Suggestion data-creatable>
        <EXPERIMENTAL_Suggestion.Input
          onInput={handleInput} // Note: using onInput, not onChange
        />
        <EXPERIMENTAL_Suggestion.Toggle />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Option data-empty />
          {options.map((option) => (
            <EXPERIMENTAL_Suggestion.Option key={option} value={option}>
              {option}
            </EXPERIMENTAL_Suggestion.Option>
          ))}
        </EXPERIMENTAL_Suggestion.List>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};
