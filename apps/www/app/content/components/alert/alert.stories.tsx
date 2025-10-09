import { Alert, Heading, Link, Paragraph } from '@digdir/designsystemet-react';

export const Preview = () => {
  return <Alert>En beskjed det er viktig at brukeren ser</Alert>;
};

export const VariantInfo = () => (
  <Alert data-color='info'>
    <Heading
      level={2}
      data-size='xs'
      style={{
        marginBottom: 'var(--ds-size-2)',
      }}
    >
      Har du husket å bestille passtime?
    </Heading>
    <Paragraph>
      Det er lange køer for å bestille pass om dagen, det kan være lurt å
      bestille i god tid før du skal reise.
    </Paragraph>
  </Alert>
);

export const VariantSuccess = () => (
  <Alert data-color='success'>
    <Heading
      level={2}
      data-size='xs'
      style={{
        marginBottom: 'var(--ds-size-2)',
      }}
    >
      Gratulerer! Du kan nå starte selskapet ditt
    </Heading>
    <Paragraph>
      Det ser ut til at regnestykket går i pluss og at du har det som skal til
      for å starte selskapet ditt.
    </Paragraph>
  </Alert>
);

export const VariantWarning = () => (
  <Alert data-color='warning'>
    <Heading
      level={2}
      data-size='xs'
      style={{
        marginBottom: 'var(--ds-size-2)',
      }}
    >
      Vi har tekniske problemer
    </Heading>
    <Paragraph>
      Det gjør at du kan bli avbrutt mens du fyller ut skjemaet. Vi jobber med å
      rette problemene.
    </Paragraph>
  </Alert>
);

export const VariantDanger = () => (
  <Alert data-color='danger'>
    <Heading
      level={2}
      data-size='xs'
      style={{
        marginBottom: 'var(--ds-size-2)',
      }}
    >
      Det har skjedd en feil
    </Heading>
    <Paragraph>
      Vi klarer ikke å hente informasjonen du ser etter akkurat nå. Prøv igjen
      litt senere. Hvis vi fortsatt ikke klarer å vise informasjonen du trenger,
      tar du kontakt med kundeservice på telefon 85 44 32 66.
    </Paragraph>
  </Alert>
);

export const WithHeading = () => (
  <Alert>
    <Heading
      level={2}
      data-size='xs'
      style={{
        marginBottom: 'var(--ds-size-2)',
      }}
    >
      Har du husket å bestille passtime?
    </Heading>
    <Paragraph>
      Det er lange køer for å bestille pass om dagen, det kan være lurt å
      bestille i god tid om du trenger pass til sommeren.
    </Paragraph>
  </Alert>
);

export const WithOnlyHeading = () => (
  <Alert data-color='warning'>
    <Paragraph> Du har 7 dager igjen på å fullføre søknaden.</Paragraph>
  </Alert>
);

export const MedLenke = () => (
  <Alert data-color='warning'>
    <Heading
      level={2}
      data-size='xs'
      style={{
        marginBottom: 'var(--ds-size-2)',
      }}
    >
      Søknadsfristen går ut om 3 dager
    </Heading>
    <Paragraph>
      Fristen for å søke opptak til utdanning er 15. april.{' '}
      <Link href='https://designsystemet.no/'>Søk nå</Link>
    </Paragraph>
  </Alert>
);
