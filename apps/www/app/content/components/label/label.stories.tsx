import { Label, Textfield } from '@digdir/designsystemet-react';

export const Preview = () => {
  return <Label>Fødselsnummer (11 sifre)</Label>;
};

export const PreviewEn = () => {
  return <Label>National identity number (11 digits)</Label>;
};

export const Weights = () => {
  return (
    <>
      <Label weight='regular'>Regular weight</Label>
      <Label weight='medium'>Medium weight</Label>
      <Label weight='semibold'>Semibold weight</Label>
    </>
  );
};

export const TextFieldLabel = () => {
  return (
    <Textfield label='Gateadresse' description='Eksempel: Solsikkeveien 44' />
  );
};

export const TextFieldLabelEn = () => {
  return (
    <Textfield
      label='Street address'
      description='Example: Sunflower Road 44'
    />
  );
};
