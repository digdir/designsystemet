import {
  Alert,
  Button,
  Heading,
  Link,
  Paragraph,
} from '@digdir/designsystemet-react';
import { useState } from 'react';

export const Preview = () => {
  return <Alert>En beskjed det er viktig at brukeren ser</Alert>;
};

export const PreviewEn = () => {
  return <Alert>A message that is important for the user to see</Alert>;
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

export const VariantInfoEn = () => (
  <Alert data-color='info'>
    <Heading
      level={2}
      data-size='xs'
      style={{
        marginBottom: 'var(--ds-size-2)',
      }}
    >
      Have you remembered to book a passport appointment?
    </Heading>
    <Paragraph>
      There are long queues for booking a passport these days, so it may be wise
      to book well in advance of your trip.
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

export const VariantSuccessEn = () => (
  <Alert data-color='success'>
    <Heading
      level={2}
      data-size='xs'
      style={{
        marginBottom: 'var(--ds-size-2)',
      }}
    >
      Congratulations! You can now start your company
    </Heading>
    <Paragraph>
      It looks like the numbers add up, and that you have what it takes to start
      your company.
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

export const VariantWarningEn = () => (
  <Alert data-color='warning'>
    <Heading
      level={2}
      data-size='xs'
      style={{
        marginBottom: 'var(--ds-size-2)',
      }}
    >
      We are experiencing technical issues
    </Heading>
    <Paragraph>
      This means you may be interrupted while filling in the form. We are
      working to fix the issues.
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

export const VariantDangerEn = () => (
  <Alert data-color='danger'>
    <Heading
      level={2}
      data-size='xs'
      style={{
        marginBottom: 'var(--ds-size-2)',
      }}
    >
      An error has occurred
    </Heading>
    <Paragraph>
      We are unable to retrieve the information you are looking for right now.
      Please try again later. If we still cannot show the information you need,
      please contact customer service on telephone 85 44 32 66.
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

export const WithHeadingEn = () => (
  <Alert>
    <Heading
      level={2}
      data-size='xs'
      style={{
        marginBottom: 'var(--ds-size-2)',
      }}
    >
      Have you remembered to book a passport appointment?
    </Heading>
    <Paragraph>
      There are long queues for booking a passport these days, so it may be wise
      to book well in advance if you need a passport for the summer.
    </Paragraph>
  </Alert>
);

export const WithOnlyHeading = () => (
  <Alert data-color='warning'>
    <Paragraph> Du har 7 dager igjen på å fullføre søknaden.</Paragraph>
  </Alert>
);

export const WithOnlyHeadingEn = () => (
  <Alert data-color='warning'>
    <Paragraph>You have 7 days left to complete the application.</Paragraph>
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
      <Link href='#'>Søk nå</Link>
    </Paragraph>
  </Alert>
);

export const MedLenkeEn = () => (
  <Alert data-color='warning'>
    <Heading
      level={2}
      data-size='xs'
      style={{
        marginBottom: 'var(--ds-size-2)',
      }}
    >
      The application deadline is in 3 days
    </Heading>
    <Paragraph>
      The deadline for applying for admission to education is 15 April.{' '}
      <Link href='#'>Apply now</Link>
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

export const CorrectLiveRegionReactEn = () => {
  const [showAlert, setShowAlert] = useState(false);
  return (
    <>
      <Button
        data-size='sm'
        variant='secondary'
        onClick={() => setShowAlert((value) => !value)}
      >
        {showAlert ? 'Hide alert' : 'Action that triggers an alert'}
      </Button>
      {/* Correct use: role="alert" is placed on the element where the alert appears */}
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
              We are unable to save the form
            </Heading>
            <Paragraph>
              We have lost the connection to the server and cannot save the
              form. Please wait a moment and try again.
            </Paragraph>
          </Alert>
        )}
      </div>
    </>
  );
};

export const Variants = () => (
  <>
    <Alert data-color='info'>Dette er en info alert</Alert>
    <Alert data-color='success'>Dette er en success alert</Alert>
    <Alert data-color='warning'>Dette er en warning alert</Alert>
    <Alert data-color='danger'>Dette er en danger alert</Alert>
  </>
);

export const VariantsEn = () => (
  <>
    <Alert data-color='info'>This is an info alert</Alert>
    <Alert data-color='success'>This is a success alert</Alert>
    <Alert data-color='warning'>This is a warning alert</Alert>
    <Alert data-color='danger'>This is a danger alert</Alert>
  </>
);
