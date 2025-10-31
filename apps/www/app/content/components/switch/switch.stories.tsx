import { Fieldset, Switch } from '@digdir/designsystemet-react';

export const Preview = () => {
  return <Switch label='Switch' />;
};

export const Checked = () => {
  return <Switch label='Switch' checked />;
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

export const RightAligned = () => {
  return <Switch label='Flymodus' position='end' checked />;
};
