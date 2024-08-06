import {
  type ColorNumber,
  getColorNameFromNumber,
} from '@digdir/designsystemet/color';

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getColorDescription = ({
  weight,
  namespace,
}: {
  weight: ColorNumber;
  namespace: string;
}) => {
  let description = `${capitalizeFirstLetter(namespace)} ${capitalizeFirstLetter(getColorNameFromNumber(weight))}`;

  if (weight === 1) {
    description += ' er den mest nøytrale bakgrunnsfargen.';
  } else if (weight === 2) {
    description += ' er en bakgrunnsfarge som har et hint av farge i seg.';
  } else if (weight === 3) {
    description +=
      ' brukes på flater som ligger oppå bakgrunnsfargene i en nøytral state. Fargen brukes i Card komponenten.';
  } else if (weight === 4) {
    description +=
      ' brukes på interaktive elementer som ligger oppå bakgrunnsfargene i en hover state.';
  } else if (weight === 5) {
    description +=
      ' brukes på interaktive elementer som ligger oppå bakgrunnsfargene i en active state.';
  } else if (weight === 6) {
    description +=
      ' er den lyseste border-fargen og brukes for å skille elementer fra hverandre. Fargen brukessom border-farge i Divider komponenten og i Tabeller.';
  } else if (weight === 7) {
    description +=
      ' er en border-farge som brukes når man ønsker god kontrast mot bakgrunnsfargene. Fargen brukes som border-farge i TextField komponenten.';
  } else if (weight === 8) {
    description +=
      ' er den mørkeste border-fargen som brukes når man ønsker god kontrast.';
  } else if (weight === 9) {
    description += ` er den lyseste tekstfargen og brukes på tekst som skal være litt mindre synlig eller for å skape variasjon i typografien.`;
  } else if (weight === 12) {
    description +=
      ' er den lyseste tekstfargen og brukes på tekst som skal være litt mindre synlig eller for å skape variasjon i typografien.';
  } else if (weight === 13) {
    description +=
      ' er den mørkeste tekstfargen og brukes på tekst som skal være mest synlig. Denne fargen bør brukes på mesteparten av teksten på en side.';
  }

  return description;
};

export const getColorCombinations = (colorNumber: number) => {
  let text = '';
  if (colorNumber === 1 || colorNumber === 2) {
    text += 'Alle fargene.';
  } else if (colorNumber === 3 || colorNumber === 4 || colorNumber === 5) {
    text += 'Background subtle- og Default.';
  } else if (colorNumber === 6) {
    text += 'Background fargene og Surface Default.';
  } else if (colorNumber === 7 || colorNumber === 8) {
    text += 'Background fargene og Surface Default';
  } else if (colorNumber === 12) {
    text += 'Background fargene og Surface Default.';
  } else if (colorNumber === 13) {
    text += 'Background- og Surface Fargene.';
  }
  return text;
};
