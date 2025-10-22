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

export const Controlled = () => {
  const [value, setValue] = useState<string>('');
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
};
