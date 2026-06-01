import {
  Textfield,
} from '@digdir/designsystemet-react';
import { useState } from 'react';

export const WithCurrentColor = () => {
  return (
    <Textfield
      label='Etternavn (Dette er en ledetekst)'
      description='Skriv bare det siste etternavnet. Hvis det er etternavn med bindestrek kan du skrive hele navnet. (Dette er en beskrivelse)'
      multiline
      rows={4}
    />
  );
};