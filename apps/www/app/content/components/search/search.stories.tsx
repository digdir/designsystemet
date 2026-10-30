import {
  Button,
  Divider,
  EXPERIMENTAL_Suggestion,
  Field,
  Input,
  Label,
  Paragraph,
} from '@digdir/designsystemet-react';
import { useState } from 'react';

export const Preview = () => {
  return (
    // TODO update to <Input> after input.css is updated with input[type="search"] styles
    <EXPERIMENTAL_Suggestion>
      <EXPERIMENTAL_Suggestion.Input type='search' aria-label='Søk' />
    </EXPERIMENTAL_Suggestion>
  );
};

export const PreviewEn = () => {
  return (
    // TODO update to <Input> after input.css is updated with input[type="search"] styles
    <EXPERIMENTAL_Suggestion>
      <EXPERIMENTAL_Suggestion.Input type='search' aria-label='Search' />
    </EXPERIMENTAL_Suggestion>
  );
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

export const Variants = () => {
  return (
    <>
      <EXPERIMENTAL_Suggestion>
        <EXPERIMENTAL_Suggestion.Input type='search' aria-label='Søk' />
        <EXPERIMENTAL_Suggestion.Clear />
      </EXPERIMENTAL_Suggestion>

      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

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

export const VariantsEn = () => {
  return (
    <>
      <EXPERIMENTAL_Suggestion>
        <EXPERIMENTAL_Suggestion.Input type='search' aria-label='Search' />
        <EXPERIMENTAL_Suggestion.Clear />
      </EXPERIMENTAL_Suggestion>

      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

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
