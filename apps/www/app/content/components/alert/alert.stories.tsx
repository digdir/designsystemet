import { Alert, Button, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { useState } from 'react';

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

export const CorrectLiveRegionReact = () => {
  const [showAlert, setShowAlert] = useState(false);
  return (
    <>
      <Button
        data-size='sm'
        variant='secondary'
        onClick={() => setShowAlert((value) => !value)}
      >
        {showAlert ? 'Skjul varsel' : 'Handling som fører til varsel'}
      </Button>
      {/* Korrekt bruk: role="alert" ligger på elementet der varselet dukker opp */}
      <div role='alert'>
        {showAlert && (
          <Alert data-color='warning'>
            <Heading
              level={2}
              data-size='xs'
              style={{
                marginBottom: 'var(--ds-size-2)',
              }}
            >
              Vi klarer ikke lagre skjemaet
            </Heading>
            <Paragraph>
              Vi har mistet forbindelsen med serveren og får ikke lagret
              skjemaet. Vent litt og prøv en gang til.
            </Paragraph>
          </Alert>
        )}
      </div>
    </>
  );
};

export const Variants = () => (
  <>
    <Alert data-color="info">
      Dette er en info alert
    </Alert>
    <Alert data-color="success">
      Dette er en success alert
    </Alert>
    <Alert data-color="warning">
      Dette er en warning alert
    </Alert>
    <Alert data-color="danger">
      Dette er en danger alert
    </Alert>
  </>
)

