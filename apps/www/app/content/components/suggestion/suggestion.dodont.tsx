import {
  EXPERIMENTAL_Suggestion,
  Field,
  FieldDescription,
  Fieldset,
  Label,
} from '@digdir/designsystemet-react';

export const DoIcon = () => {
  const DATA_PLACES = [
    'Albania',
    'Andorra',
    'Belgia',
    'Bosnia-Hercegovina',
    'Bulgaria',
    'Danmark',
    'Estland',
    'Finland',
    'Frankrike',
    'Georgia',
    'Hellas',
    'Irland',
    'Island',
    'Italia',
    'Kasakhstan',
    'Kosovo',
    'Kroatia',
    'Latvia',
    'Liechtenstein',
    'Litauen',
    'Luxembourg',
    'Malta',
    'Moldova',
    'Monaco',
    'Montenegro',
    'Nederland',
    'Nord-Makedonia',
    'Norge',
    'Polen',
    'Portugal',
    'Romania',
    'Russland',
    'San Marino',
    'Serbia',
    'Slovakia',
    'Slovenia',
    'Spania',
    'Storbritannia',
    'Sveits',
    'Sverige',
    'Tsjekkia',
    'Tyskland',
    'Ukraina',
    'Ungarn',
    'Vatikanstaten',
    'Østerrike',
  ];
  return (
    <Field>
      <Label>Hvilket land er du fra?</Label>
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
              <div>Europa</div>
            </EXPERIMENTAL_Suggestion.Option>
          ))}
        </EXPERIMENTAL_Suggestion.List>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};

export const DontIcon = () => {
  const DATA_PLACES = [
    'Albania',
    'Andorra',
    'Belgia',
    'Bosnia-Hercegovina',
    'Bulgaria',
    'Danmark',
    'Estland',
    'Finland',
    'Frankrike',
    'Georgia',
    'Hellas',
    'Irland',
    'Island',
    'Italia',
    'Kasakhstan',
    'Kosovo',
    'Kroatia',
    'Latvia',
    'Liechtenstein',
    'Litauen',
    'Luxembourg',
    'Malta',
    'Moldova',
    'Monaco',
    'Montenegro',
    'Nederland',
    'Nord-Makedonia',
    'Norge',
    'Polen',
    'Portugal',
    'Romania',
    'Russland',
    'San Marino',
    'Serbia',
    'Slovakia',
    'Slovenia',
    'Spania',
    'Storbritannia',
    'Sveits',
    'Sverige',
    'Tsjekkia',
    'Tyskland',
    'Ukraina',
    'Ungarn',
    'Vatikanstaten',
    'Østerrike',
  ];
  return (
    <Field>
      <Label>Skriv for å søke etter land</Label>
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
              <div>Europa</div>
            </EXPERIMENTAL_Suggestion.Option>
          ))}
        </EXPERIMENTAL_Suggestion.List>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};
