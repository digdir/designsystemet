import { useState } from 'react';
import preview from '../../../../../apps/storybook/.storybook/preview';
import {
  Button,
  Divider,
  Field,
  Fieldset,
  Input,
  Label,
  Tag,
  Textarea,
  ValidationMessage,
} from '../';

const meta = preview.meta({
  title: 'Komponenter/Field',
  component: Field,
  parameters: {
    customStyles: {
      maxWidth: 600,
      width: '90vw',
    },
  },
});

export const Preview = meta.story(() => {
  return (
    <Field>
      <Label>Etternavn</Label>
      <Field.Description>
        Etternavn kan ikke inneholde mellomrom
      </Field.Description>
      <Input defaultValue='Nordmann Svenske' />
      <ValidationMessage>
        Du kan ikke ha mellomrom i etternavnet ditt
      </ValidationMessage>
    </Field>
  );
});

export const Affix = meta.story(() => (
  <Field>
    <Label>Hvor mange kroner koster det per måned?</Label>
    <Field.Affixes>
      <Field.Affix>NOK</Field.Affix>
      <Input />
      <Field.Affix>pr. mnd.</Field.Affix>
    </Field.Affixes>
  </Field>
));

export const Counter = meta.story(() => (
  <Field>
    <Label>Legg til en beskrivelse</Label>
    <Textarea rows={2} />
    <Field.Counter limit={10} />
  </Field>
));

export const CounterControlled = meta.story(() => {
  const [value, setValue] = useState('Nordmann');

  return (
    <>
      <Field>
        <Label>Legg til en beskrivelse</Label>
        <Textarea
          rows={2}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Field.Counter limit={10} />
      </Field>
      <Button onClick={() => setValue('Hei')}>Set verdi "hei"</Button>
    </>
  );
});

export const Position = meta.story({
  render: () => (
    <>
      <Field position='end'>
        <Label>Flymodus</Label>
        <Input type='checkbox' role='switch' />
      </Field>
      <Divider />
      <Field position='end'>
        <Label>Lydløs</Label>
        <Input type='checkbox' role='switch' />
      </Field>
    </>
  ),

  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: 200,
          margin: 'auto',
        }}
      >
        <Story />
      </div>
    ),
  ],
});

export const Optional = meta.story(() => (
  <Field>
    <Label>
      Hvor bor du?
      <Tag data-color='info' style={{ marginInlineStart: 'var(--ds-size-2)' }}>
        Valgfritt
      </Tag>
    </Label>
    <Input />
  </Field>
));

export const Outline = meta.story(() => (
  <>
    <Fieldset>
      <Fieldset.Legend>Using variant="outline"</Fieldset.Legend>
      <Field data-variant='outline'>
        <Label>With description</Label>
        <Field.Description>Description text</Field.Description>
        <Input type='checkbox' />
      </Field>
      <Field data-variant='outline'>
        <Label>Checked</Label>
        <Input type='checkbox' defaultChecked />
      </Field>
      <Field data-variant='outline'>
        <Label>With error state</Label>
        <Input type='checkbox' defaultChecked />
        <ValidationMessage>Error message</ValidationMessage>
      </Field>
      <Field data-variant='outline'>
        <Label>With error state</Label>
        <Input type='checkbox' defaultChecked />
        <ValidationMessage>Error message</ValidationMessage>
      </Field>
      <Field data-variant='outline'>
        <Label>Disabled not checked</Label>
        <Input type='checkbox' disabled />
      </Field>
      <Field data-variant='outline'>
        <Label>Disabled checked</Label>
        <Input type='checkbox' disabled defaultChecked />
      </Field>
      <Field data-variant='outline'>
        <Label>Readonly not checked</Label>
        <Input type='checkbox' readOnly />
      </Field>
      <Field data-variant='outline'>
        <Label>Readonly checked</Label>
        <Input type='checkbox' readOnly defaultChecked />
      </Field>
    </Fieldset>
  </>
));

export const Chip = meta.story(() => (
  <>
    <Fieldset>
      <Fieldset.Legend>Using variant="chip"</Fieldset.Legend>
      <div
        style={{
          display: 'flex',
          gap: 'var(--ds-size-2)',
          flexWrap: 'wrap',
          alignItems: 'start',
        }}
      >
        <Field data-variant='chip'>
          <Label>Not checked</Label>
          <Input type='checkbox' />
        </Field>
        <Field data-variant='chip'>
          <Label>Checked</Label>
          <Input type='checkbox' defaultChecked />
        </Field>
        <Field data-variant='chip'>
          <Label>With description</Label>
          <Field.Description>Description text</Field.Description>
          <Input type='checkbox' />
        </Field>
        <Field data-variant='chip'>
          <Label>With error state</Label>
          <Input type='checkbox' defaultChecked />
          <ValidationMessage>Error message</ValidationMessage>
        </Field>
        <Field data-variant='chip'>
          <Label>With error state</Label>
          <Input type='checkbox' defaultChecked />
          <ValidationMessage>Error message</ValidationMessage>
        </Field>
        <Field data-variant='chip'>
          <Label>Disabled not checked</Label>
          <Input type='checkbox' disabled />
        </Field>
        <Field data-variant='chip'>
          <Label>Disabled checked</Label>
          <Input type='checkbox' disabled defaultChecked />
        </Field>
        <Field data-variant='chip'>
          <Label>Readonly not checked</Label>
          <Input type='checkbox' readOnly />
        </Field>
        <Field data-variant='chip'>
          <Label>Readonly checked</Label>
          <Input type='checkbox' readOnly defaultChecked />
        </Field>
        <div style={{ width: '100%', height: '1em' }} />
        <Field data-variant='chip'>
          <Label>Not checked</Label>
          <Input type='radio' />
        </Field>
        <Field data-variant='chip'>
          <Label>Checked</Label>
          <Input type='radio' defaultChecked />
        </Field>
        <Field data-variant='chip'>
          <Label>With description</Label>
          <Field.Description>Description text</Field.Description>
          <Input type='radio' />
        </Field>
        <Field data-variant='chip'>
          <Label>With error state</Label>
          <Input type='radio' defaultChecked />
          <ValidationMessage>Error message</ValidationMessage>
        </Field>
        <Field data-variant='chip'>
          <Label>With error state</Label>
          <Input type='radio' defaultChecked />
          <ValidationMessage>Error message</ValidationMessage>
        </Field>
        <Field data-variant='chip'>
          <Label>Disabled not checked</Label>
          <Input type='radio' disabled />
        </Field>
        <Field data-variant='chip'>
          <Label>Disabled checked</Label>
          <Input type='radio' disabled defaultChecked />
        </Field>
        <Field data-variant='chip'>
          <Label>Readonly not checked</Label>
          <Input type='radio' readOnly />
        </Field>
        <Field data-variant='chip'>
          <Label>Readonly checked</Label>
          <Input type='radio' readOnly defaultChecked />
        </Field>
      </div>
    </Fieldset>
  </>
));
