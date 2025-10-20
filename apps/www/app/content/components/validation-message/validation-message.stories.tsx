import { ValidationMessage } from '@digdir/designsystemet-react';

export const Preview = () => (
  <ValidationMessage>Dette er en valideringsmelding.</ValidationMessage>
);

export const WithError = () => (
  <ValidationMessage>Dette er en feilmelding.</ValidationMessage>
);
