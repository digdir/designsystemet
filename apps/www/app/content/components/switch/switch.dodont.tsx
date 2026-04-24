import { Fieldset, Switch } from '@digdir/designsystemet-react';

export const DoIcon = () => {
  return <Switch label='Flymodus' data-color='accent' />;
};
export const DontIcon = () => {
  return <Switch label='Skru av flymodus' data-color='accent' />;
};

export const DoIconEN = () => {
  return <Switch label='Flight mode' data-color='accent' />;
};

export const DontIconEN = () => {
  return <Switch label='Turn off flight mode' data-color='accent' />;
};

export const DoIcon2 = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Slå av/på varsler</Fieldset.Legend>
      <Switch label='E-post' />
      <Switch label='SMS' />
    </Fieldset>
  );
};
export const DontIcon2 = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Slå av/på varsler</Fieldset.Legend>
      <Switch label='Send E-post' />
      <Switch label='SMS' />
    </Fieldset>
  );
};

export const DoIcon2EN = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Turn notifications on/off</Fieldset.Legend>
      <Switch label='Email' />
      <Switch label='SMS' />
    </Fieldset>
  );
};

export const DontIcon2EN = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Turn notifications on/off</Fieldset.Legend>
      <Switch label='Send email' />
      <Switch label='SMS' />
    </Fieldset>
  );
};
