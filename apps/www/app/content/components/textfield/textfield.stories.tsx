import { Textfield } from '@digdir/designsystemet-react';

export const Preview = () => <Textfield label='Label' />;

export const WithRows = () => <Textfield label='Label' multiline rows={4} />;

export const WithAffix = () => (
  <Textfield
    prefix='NOK'
    suffix='pr. mnd'
    label='Hvor mange kroner koster det per måned?'
  />
);

export const WithCounter = () => (
  <Textfield counter={10} label='Hvor mange kroner koster det per måned?' />
);

export const Disabled = () => <Textfield label='Label' disabled value='Disabled' />;

export const ReadOnly = () => <Textfield label='Label' readOnly value='ReadOnly' />;

export const WithError = () => (
  <Textfield label='Label' error='Dette feltet er påkrevd' />
);
