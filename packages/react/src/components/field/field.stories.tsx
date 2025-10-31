import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  Divider,
  Field,
  Input,
  Label,
  Tag,
  Textarea,
  ValidationMessage,
} from '../';

type Story = StoryFn<typeof Field>;

export default {
  title: 'Komponenter/Field',
  component: Field,
  parameters: {
    customStyles: {
      maxWidth: 600,
      width: '90vw',
    },
  },
} as Meta;

export const Preview: Story = () => {
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
};

export const Affix: Story = () => (
  <Field>
    <Label>Hvor mange kroner koster det per måned?</Label>
    <Field.Affixes>
      <Field.Affix>NOK</Field.Affix>
      <Input />
      <Field.Affix>pr. mnd.</Field.Affix>
    </Field.Affixes>
  </Field>
);

export const Counter: Story = () => (
  <Field>
    <Label>Legg til en beskrivelse</Label>
    <Textarea rows={2} />
    <Field.Counter limit={10} />
  </Field>
);

export const Position: Story = () => (
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
);

Position.decorators = [
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
];

export const Optional: Story = () => (
  <Field>
    <Label>
      Hvor bor du?<Tag data-color='info'>Valgfritt</Tag>
    </Label>
    <Input />
  </Field>
);
