import { Fieldset, Switch } from '@digdir/designsystemet-react';

export const Preview = () => <Switch label='Switch' />;

export const Checked = () => <Switch label='Switch' checked />;

export const Group = () => (
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

export const RightAligned = () => (
  <Switch label='Flymodus' position='end' checked />
);
