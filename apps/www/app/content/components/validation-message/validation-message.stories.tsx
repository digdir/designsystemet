import { ValidationMessage } from '@digdir/designsystemet-react';

export const Preview = () => {
  return <ValidationMessage>Dette er en valideringsmelding.</ValidationMessage>;
};

export const AllColors = () => {
  return (
    <>
      <ValidationMessage data-color='danger'>
        Dette er en feilmelding.
      </ValidationMessage>
      <ValidationMessage data-color='success'>
        Dette er en advarsel.
      </ValidationMessage>
      <ValidationMessage data-color='info'>
        Dette er en informasjon.
      </ValidationMessage>
      <ValidationMessage data-color='warning'>
        Dette er en feilmelding.
      </ValidationMessage>
    </>
  );
};
