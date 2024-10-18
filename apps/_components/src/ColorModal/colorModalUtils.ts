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
      ' brukes på flater som ligger oppå bakgrunnsfargene. Fargen brukes for eksempel i Card komponenten til Designsystemet.';
  } else if (weight === 4) {
    description +=
      ' brukes på interaktive flater som ligger oppå bakgrunnsfargene i en hover state.';
  } else if (weight === 5) {
    description +=
      ' brukes på interaktive flater som ligger oppå bakgrunnsfargene i en active state.';
  } else if (weight === 6) {
    description +=
      ' er den lyseste border-fargen og brukes for å skille elementer fra hverandre.';
  } else if (weight === 7) {
    description +=
      ' er en border-farge som brukes når man ønsker god kontrast mot bakgrunnsfargene.';
  } else if (weight === 8) {
    description +=
      ' er den mørkeste border-fargen og brukes når man ønsker en veldig tydelig og sterk border.';
  } else if (weight === 9) {
    description += ` fargen får den samme hex koden som fargen som er valgt i verktøyet. Brukes ofte som farge på viktige elementer og på flater som skal fange brukerens oppmerksomhet.`;
  } else if (weight === 10) {
    description += `  kan brukes som hover farge på elementer som bruker Base Default fargen. `;
  } else if (weight === 11) {
    description += ` kan brukes som active farge på elementer som bruker Base Default fargen`;
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
