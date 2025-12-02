import {
  Divider,
  Field,
  Fieldset,
  Input,
  Label,
  Switch,
} from '@digdir/designsystemet-react';

export const Preview = () => {
  return <Switch label='Switch' />;
};

export const Group = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Skru av/på lys</Fieldset.Legend>
      <Switch label='Stue' checked />
      <Switch label='Kjøkken' />
      <Switch label='Bad' />
      <Switch
        label='Soverom'
        description='Får ikke kontakt med lyspærene'
        readOnly
      />
    </Fieldset>
  );
};

export const GroupEn = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Turn lights on/off</Fieldset.Legend>
      <Switch label='Living room' checked />
      <Switch label='Kitchen' />
      <Switch label='Bathroom' />
      <Switch
        label='Bedroom'
        description='Unable to connect to the light bulbs'
        readOnly
      />
    </Fieldset>
  );
};

export const RightAligned = () => {
  return <Switch label='Flymodus' position='end' defaultChecked />;
};

export const RightAlignedEn = () => {
  return <Switch label='Flight mode' position='end' defaultChecked />;
};

export const RightAligned2 = () => (
  <div
    style={{
      flexDirection: 'column',
      width: '100%',
      maxWidth: '380px',
    }}
  >
    <Divider />

    <Field
      position='end'
      style={{
        alignItems: 'center',
        padding: 'var(--ds-size-2) 0',
      }}
    >
      <Label>Flymodus</Label>
      <Input type='checkbox' role='switch' />
    </Field>

    <Divider />

    <Field
      position='end'
      style={{
        alignItems: 'center',
        padding: 'var(--ds-size-2) 0',
      }}
    >
      <Label>Lydløs</Label>
      <Input type='checkbox' role='switch' />
    </Field>

    <Divider />
  </div>
);
