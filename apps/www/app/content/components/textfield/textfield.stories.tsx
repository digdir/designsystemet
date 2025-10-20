import { Textfield } from '@digdir/designsystemet-react';

export const Preview = () => {
  return <Textfield label='Label' />;
};

export const WithRows = () => {
  return <Textfield label='Label' multiline rows={4} />;
};

export const WithAffix = () => {
  return (
    <Textfield
      prefix='NOK'
      suffix='pr. mnd'
      label='Hvor mange kroner koster det per måned?'
    />
  );
};

export const WithCounter = () => {
  return (
    <Textfield counter={10} label='Hvor mange kroner koster det per måned?' />
  );
};

export const Disabled = () => {
  return <Textfield label='Label' disabled value='Disabled' />;
};

export const ReadOnly = () => {
  return <Textfield label='Label' readOnly value='ReadOnly' />;
};

export const WithError = () => {
  return <Textfield label='Label' error='Dette feltet er påkrevd' />;
};
