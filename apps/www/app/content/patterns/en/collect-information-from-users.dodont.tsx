import {
  Divider,
  EXPERIMENTAL_Suggestion,
  Field,
  Label,
} from '@digdir/designsystemet-react';

export const DontPreselectedOption = () => {
  const languages = [
    'Arabic',
    'Bosnian',
    'Dari',
    'Dutch',
    'English',
    'Finnish',
    'French',
    'German',
    'Kurdish',
    'Lithuanian',
    'Norwegian',
    'Pashto',
    'Persian',
    'Polish',
    'Russian',
    'Sami',
    'Somali',
    'Spanish',
    'Swedish',
    'Tamil',
    'Thai',
    'Tigrinya',
    'Turkish',
    'Ukrainian',
    'Urdu',
    'Vietnamese',
  ];

  return (
    <Field>
      <Label>What is your first language?</Label>
      <EXPERIMENTAL_Suggestion defaultSelected='Norwegian'>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Toggle />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Empty>
            No languages found
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
  const mostUsed = ['Norwegian', 'Sami'];
  const languages = [
    'Arabic',
    'Bosnian',
    'Dari',
    'Dutch',
    'English',
    'Finnish',
    'French',
    'German',
    'Kurdish',
    'Lithuanian',
    'Pashto',
    'Persian',
    'Polish',
    'Russian',
    'Somali',
    'Spanish',
    'Swedish',
    'Tamil',
    'Thai',
    'Tigrinya',
    'Turkish',
    'Ukrainian',
    'Urdu',
    'Vietnamese',
  ];

  return (
    <Field>
      <Label>What is your first language?</Label>
      <EXPERIMENTAL_Suggestion>
        <EXPERIMENTAL_Suggestion.Input />
        <EXPERIMENTAL_Suggestion.Toggle />
        <EXPERIMENTAL_Suggestion.Clear />
        <EXPERIMENTAL_Suggestion.List>
          <EXPERIMENTAL_Suggestion.Empty>
            No languages found
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
