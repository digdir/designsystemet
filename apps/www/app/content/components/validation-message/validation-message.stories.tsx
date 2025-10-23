import { ValidationMessage } from '@digdir/designsystemet-react';

export const Preview = () => {
  return <ValidationMessage>Dette er en valideringsmelding.</ValidationMessage>;
};

export const WithError = () => {
  return <ValidationMessage>Dette er en feilmelding.</ValidationMessage>;
};
