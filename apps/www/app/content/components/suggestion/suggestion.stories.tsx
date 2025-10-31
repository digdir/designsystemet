import {
  EXPERIMENTAL_Suggestion,
  Field,
  Label,
} from '@digdir/designsystemet-react';

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
      <EXPERIMENTAL_Suggestion multiple>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Empty>Tomt</EXPERIMENTAL_Suggestion.Empty>
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
