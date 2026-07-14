import { useState } from 'react';
import preview from '../../../../../apps/storybook/.storybook/preview';

import { Button, Divider, Field, Label, Paragraph } from '../../';

import { Search } from './';

const meta = preview.meta({
  title: 'Komponenter/Search',
  component: Search,
});

export const Preview = meta.story({
  render: (args) => (
    <Search {...args}>
      <Search.Input aria-label='Søk' />
      <Search.Clear />
      <Search.Button />
    </Search>
  ),
});

export const Controlled = meta.story(() => {
  const [value, setValue] = useState<string>();
  return (
    <>
      <Search>
        <Search.Input
          aria-label='Søk'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Search.Clear />
        <Search.Button />
      </Search>

      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

      <Paragraph style={{ margin: 'var(--ds-size-2) 0' }}>
        Du har skrevet inn: {value}
      </Paragraph>
      <Button onClick={() => setValue('Pizza')}>Jeg vil ha Pizza</Button>
    </>
  );
});

export const Variants = meta.story(() => (
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
));

export const WithLabel = meta.story(() => (
  <Field>
    <Label>Søk etter katter</Label>
    <Search>
      <Search.Input name='cat-search' />
      <Search.Clear />
      <Search.Button />
    </Search>
  </Field>
));

export const Form = meta.story(() => {
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
});
