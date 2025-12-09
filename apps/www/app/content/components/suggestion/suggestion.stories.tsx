import {
  Button,
  Divider,
  EXPERIMENTAL_Suggestion,
  Field,
  Label,
  Paragraph,
} from '@digdir/designsystemet-react';
import { useState } from 'react';

export const Preview = () => {
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
      <EXPERIMENTAL_Suggestion>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Empty>
            Ingen treff
          </EXPERIMENTAL_Suggestion.Empty>
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
      <EXPERIMENTAL_Suggestion>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Empty>
            No results found
          </EXPERIMENTAL_Suggestion.Empty>
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
      <EXPERIMENTAL_Suggestion multiple>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Empty>
            Ingen treff
          </EXPERIMENTAL_Suggestion.Empty>
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
      <EXPERIMENTAL_Suggestion multiple>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Empty>
            No results found
          </EXPERIMENTAL_Suggestion.Empty>
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
  return (
    <Field>
      <Label>Skriv inn et tall mellom 1-6</Label>
      <EXPERIMENTAL_Suggestion filter={false}>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Empty>
            Ingen treff
          </EXPERIMENTAL_Suggestion.Empty>
          {DATA_PLACES.map((label) => (
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
  const [selected, setSelected] = useState<string[]>(['Oslo']);

  return (
    <>
      <Field>
        <Label>Velg destinasjoner</Label>
        <EXPERIMENTAL_Suggestion
          multiple
          selected={selected}
          onSelectedChange={(items) =>
            setSelected(items.map((item) => item.value))
          }
        >
          <EXPERIMENTAL_Suggestion.Input />
          <EXPERIMENTAL_Suggestion.Clear />
          <EXPERIMENTAL_Suggestion.List>
            <EXPERIMENTAL_Suggestion.Empty>
              Ingen treff
            </EXPERIMENTAL_Suggestion.Empty>
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
        Valgte reisemål: {selected.join(', ')}
      </Paragraph>

      <Button
        onClick={() => {
          setSelected(['Sogndal', 'Stavanger']);
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
  const [selected, setSelected] = useState<string[]>(['Oslo']);

  return (
    <>
      <Field>
        <Label>Select destinations</Label>
        <EXPERIMENTAL_Suggestion
          multiple
          selected={selected}
          onSelectedChange={(items) =>
            setSelected(items.map((item) => item.value))
          }
        >
          <EXPERIMENTAL_Suggestion.Input />
          <EXPERIMENTAL_Suggestion.Clear />
          <EXPERIMENTAL_Suggestion.List>
            <EXPERIMENTAL_Suggestion.Empty>
              No results found
            </EXPERIMENTAL_Suggestion.Empty>
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
        Selected destinations: {selected.join(', ')}
      </Paragraph>

      <Button
        onClick={() => {
          setSelected(['Sogndal', 'Stavanger']);
        }}
      >
        Set destinations to Sogndal, Stavanger
      </Button>
    </>
  );
};
