import {
  Divider,
  EXPERIMENTAL_Suggestion,
  Field,
  Label,
} from '@digdir/designsystemet-react';

export const DontPreselectedOption = () => {
  const languages = [
    'Arabisk',
    'Bosnisk',
    'Dari',
    'Engelsk',
    'Finsk',
    'Fransk',
    'Kurdisk',
    'Litauisk',
    'Nederlandsk',
    'Norsk',
    'Pashto',
    'Persisk',
    'Polsk',
    'Russisk',
    'Samisk',
    'Somali',
    'Spansk',
    'Svensk',
    'Tamil',
    'Thai',
    'Tigrinja',
    'Tyrkisk',
    'Tysk',
    'Ukrainsk',
    'Urdu',
    'Vietnamesisk',
  ];

  return (
    <Field>
      <Label>Hva er morsmålet ditt?</Label>
      <EXPERIMENTAL_Suggestion defaultSelected='Norsk'>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Toggle />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Empty>
            Fant ingen språk
          </EXPERIMENTAL_Suggestion.Empty>
          {languages.map((language) => (
            <EXPERIMENTAL_Suggestion.Option key={language}>
              {language}
            </EXPERIMENTAL_Suggestion.Option>
          ))}
        </EXPERIMENTAL_Suggestion.List>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};

export const DoMostUsedOptionFirst = () => {
  const mostUsed = ['Norsk', 'Samisk'];
  const languages = [
    'Arabisk',
    'Bosnisk',
    'Dari',
    'Engelsk',
    'Finsk',
    'Fransk',
    'Kurdisk',
    'Litauisk',
    'Nederlandsk',
    'Pashto',
    'Persisk',
    'Polsk',
    'Russisk',
    'Somali',
    'Spansk',
    'Svensk',
    'Tamil',
    'Thai',
    'Tigrinja',
    'Tyrkisk',
    'Tysk',
    'Ukrainsk',
    'Urdu',
    'Vietnamesisk',
  ];

  return (
    <Field>
      <Label>Hva er morsmålet ditt?</Label>
      <EXPERIMENTAL_Suggestion>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Toggle />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Empty>
            Fant ingen språk
          </EXPERIMENTAL_Suggestion.Empty>
          {mostUsed.map((language) => (
            <EXPERIMENTAL_Suggestion.Option key={language}>
              {language}
            </EXPERIMENTAL_Suggestion.Option>
          ))}
          <Divider />
          {languages.map((language) => (
            <EXPERIMENTAL_Suggestion.Option key={language}>
              {language}
            </EXPERIMENTAL_Suggestion.Option>
          ))}
        </EXPERIMENTAL_Suggestion.List>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};
