import { useState } from 'react';
import preview from '../../../../../apps/storybook/.storybook/preview';

import { Button, Divider, Paragraph, Tag } from '../../';

import { Textfield } from './textfield';

const meta = preview.meta({
  title: 'Komponenter/Textfield',
  component: Textfield,
});

export const Preview = meta.story({
  args: {
    label: 'Label',
    disabled: false,
    readOnly: false,
    multiline: false,
    description: '',
    error: '',
    counter: 0,
  },
});

export const Rows = meta.story({
  args: {
    label: 'Label',
    multiline: true,
    rows: 4,
  },
});

export const Affix = meta.story({
  args: {
    prefix: 'NOK',
    suffix: 'pr. mnd',
    label: 'Hvor mange kroner koster det per måned?',
  },
});

export const Counter = meta.story({
  args: {
    counter: 10,
    label: 'Hvor mange kroner koster det per måned?',
  },
});

export const Controlled = meta.story(() => {
  const [value, setValue] = useState<string>('Ost');
  return (
    <>
      <Textfield
        label='Kontroller meg!'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        counter={5}
      />

      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

      <Paragraph style={{ margin: 'var(--ds-size-2) 0' }}>
        Du har skrevet inn: {value}
      </Paragraph>
      <Button onClick={() => setValue('Kake')}>Jeg vil ha Kake</Button>
    </>
  );
});

export const DateInputs = meta.story(() => {
  return (
    <>
      <Textfield label='text' type='text' />
      <Textfield label='tel' type='tel' />
      <Textfield label='time' type='time' />
      <Textfield label='date' type='date' />
      <Textfield label='datetime-local' type='datetime-local' />
      <Textfield label='month' type='month' />
      <Textfield label='week' type='week' />
    </>
  );
});

export const Required = meta.story({
  args: {
    label: (
      <>
        Hvor bor du?
        <Tag
          data-color='warning'
          style={{ marginInlineStart: 'var(--ds-size-2)' }}
        >
          Må fylles ut
        </Tag>
      </>
    ),
    required: true,
  },
});
