import { Label } from '@digdir/designsystemet-react';

export const Preview = () => {
  return <Label>Fødselsnummer (11 sifre)</Label>;
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
