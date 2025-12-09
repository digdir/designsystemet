import { ValidationMessage } from '@digdir/designsystemet-react';

export const Preview = () => {
  return <ValidationMessage>Dette er en valideringsmelding.</ValidationMessage>;
};

export const PreviewEn = () => {
  return <ValidationMessage>This is a validation message.</ValidationMessage>;
};

export const AllColors = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ValidationMessage data-color='danger'>
        Dette er en feilmelding.
      </ValidationMessage>

      <ValidationMessage data-color='success'>
        Dette er en suksessmelding.
      </ValidationMessage>

      <ValidationMessage data-color='info'>
        Dette er en informasjonsmelding.
      </ValidationMessage>

      <ValidationMessage data-color='warning'>
        Dette er en advarsel.
      </ValidationMessage>
    </div>
  );
};

export const AllColorsEn = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ValidationMessage data-color='danger'>
        This is an error message.
      </ValidationMessage>

      <ValidationMessage data-color='success'>
        This is a success message.
      </ValidationMessage>

      <ValidationMessage data-color='info'>
        This is an informational message.
      </ValidationMessage>

      <ValidationMessage data-color='warning'>
        This is a warning message.
      </ValidationMessage>
    </div>
  );
};
