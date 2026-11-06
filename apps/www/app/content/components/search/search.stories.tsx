import {
  Button,
  Divider,
  EXPERIMENTAL_Suggestion,
  Field,
  Input,
  Label,
} from '@digdir/designsystemet-react';
import { useState } from 'react';

export const Preview = () => {
  return <Input type='search' aria-label='Søk' />;
};

export const PreviewEn = () => {
  return <Input type='search' aria-label='Search' />;
};

export const WithInput = () => {
  return (
    <Field>
      <Label>Søk</Label>
      <Input type='search' />
    </Field>
  );
};

export const WithInputEn = () => {
  return (
    <Field>
      <Label>Search</Label>
      <Input type='search' />
    </Field>
  );
};

export const WithLabel = () => {
  return (
    <Field>
      <Label>Søk etter katter</Label>
      <EXPERIMENTAL_Suggestion>
        <EXPERIMENTAL_Suggestion.Input type='text' name='cat-search' />
        <EXPERIMENTAL_Suggestion.Clear />
        <Button type='submit'>Søk</Button>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};

export const WithLabelEn = () => {
  return (
    <Field>
      <Label>Search for cats</Label>
      <EXPERIMENTAL_Suggestion>
        <EXPERIMENTAL_Suggestion.Input type='text' name='cat-search' />
        <EXPERIMENTAL_Suggestion.Clear />
        <Button type='submit'>Search</Button>
      </EXPERIMENTAL_Suggestion>
    </Field>
  );
};

export const WithClear = () => {
  return (
    <EXPERIMENTAL_Suggestion>
      <EXPERIMENTAL_Suggestion.Input type='search' aria-label='Søk' />
      <EXPERIMENTAL_Suggestion.Clear />
    </EXPERIMENTAL_Suggestion>
  );
};

export const WithClearEn = () => {
  return (
    <EXPERIMENTAL_Suggestion>
      <EXPERIMENTAL_Suggestion.Input type='search' aria-label='Search' />
      <EXPERIMENTAL_Suggestion.Clear />
    </EXPERIMENTAL_Suggestion>
  );
};

export const WithSearchButton = () => {
  return (
    <>
      <EXPERIMENTAL_Suggestion>
        <EXPERIMENTAL_Suggestion.Input type='text' aria-label='Søk' />
        <EXPERIMENTAL_Suggestion.Clear />
        <Button type='submit'>Søk</Button>
      </EXPERIMENTAL_Suggestion>

      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

      <EXPERIMENTAL_Suggestion>
        <EXPERIMENTAL_Suggestion.Input type='text' aria-label='Søk' />
        <EXPERIMENTAL_Suggestion.Clear />
        <Button type='submit' variant='secondary'>
          Søk
        </Button>
      </EXPERIMENTAL_Suggestion>
    </>
  );
};

export const WithSearchButtonEn = () => {
  return (
    <>
      <EXPERIMENTAL_Suggestion>
        <EXPERIMENTAL_Suggestion.Input type='text' aria-label='Search' />
        <EXPERIMENTAL_Suggestion.Clear />
        <Button type='submit'>Search</Button>
      </EXPERIMENTAL_Suggestion>

      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

      <EXPERIMENTAL_Suggestion>
        <EXPERIMENTAL_Suggestion.Input type='text' aria-label='Search' />
        <EXPERIMENTAL_Suggestion.Clear />
        <Button type='submit' variant='secondary'>
          Search
        </Button>
      </EXPERIMENTAL_Suggestion>
    </>
  );
};

export const Form = () => {
  const [submittedValue, setSubmittedValue] = useState<string>();

  return (
    <>
      <form
        onSubmit={(e) => {
          // Prevent navigation from Storybook
          e.preventDefault();
          setSubmittedValue(
            new FormData(e.currentTarget).get('search')?.toString(),
          );
        }}
      >
        <EXPERIMENTAL_Suggestion>
          <EXPERIMENTAL_Suggestion.Input
            type='text'
            name='search'
            aria-label='Søk'
          />
          <EXPERIMENTAL_Suggestion.Clear />
          <Button type='submit'>Søk</Button>
        </EXPERIMENTAL_Suggestion>
      </form>

      <Paragraph data-size='md' style={{ marginTop: 'var(--ds-size-2)' }}>
        Submitted value: {submittedValue}
      </Paragraph>
    </>
  );
};
