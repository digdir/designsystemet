import {
  Button,
  Divider,
  Field,
  Label,
  Paragraph,
  Search,
} from '@digdir/designsystemet-react';
import { useState } from 'react';

export const Preview = () => {
  return (
    <Search>
      <Search.Input aria-label='Søk' />
      <Search.Clear />
      <Search.Button />
    </Search>
  );
};

export const PreviewEn = () => {
  return (
    <Search>
      <Search.Input aria-label='Søk' />
      <Search.Clear />
      <Button>Search</Button>
    </Search>
  );
};

export const WithLabel = () => {
  return (
    <Field>
      <Label>Søk etter katter</Label>
      <Search>
        <Search.Input name='cat-search' />
        <Search.Clear />
        <Search.Button />
      </Search>
    </Field>
  );
};

export const WithLabelEn = () => {
  return (
    <Field>
      <Label>Search for cats</Label>
      <Search>
        <Search.Input name='cat-search' />
        <Search.Clear />
        <Button>Search</Button>
      </Search>
    </Field>
  );
};

export const Variants = () => {
  return (
    <>
      <Search>
        <Search.Input aria-label='Søk' />
        <Search.Clear />
      </Search>

      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

      <Search>
        <Search.Input aria-label='Søk' />
        <Search.Clear />
        <Search.Button />
      </Search>

      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

      <Search>
        <Search.Input aria-label='Søk' />
        <Search.Clear />
        <Search.Button variant='secondary' />
      </Search>
    </>
  );
};

export const VariantsEn = () => {
  return (
    <>
      <Search>
        <Search.Input aria-label='Søk' />
        <Search.Clear />
      </Search>

      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

      <Search>
        <Search.Input aria-label='Søk' />
        <Search.Clear />
        <Button>Search</Button>
      </Search>

      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

      <Search>
        <Search.Input aria-label='Søk' />
        <Search.Clear />
        <Button variant='secondary'>Search</Button>
      </Search>
    </>
  );
};

export const Form = () => {
  const [value, setValue] = useState<string>();
  const [submittedValue, setSubmittedValue] = useState<string>();

  return (
    <>
      <form
        onSubmit={(e) => {
          // Prevent navigation from Storybook
          e.preventDefault();
          setSubmittedValue(value);
        }}
      >
        <Search>
          <Search.Input
            aria-label='Søk'
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Search.Clear />
          <Search.Button />
        </Search>
      </form>

      <Paragraph data-size='md' style={{ marginTop: 'var(--ds-size-2)' }}>
        Submitted value: {submittedValue}
      </Paragraph>
    </>
  );
};
