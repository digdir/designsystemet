import { createHtmlStory } from '@story-utils/createHtmlStory';
import { formatReactSource } from '@story-utils/transformSource';
import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { Alert } from '.';
import { Button, Heading, Link, Paragraph } from '../';
import correctLiveRegionHtml from './html-examples/correct-live-region.html?raw';
import wrongLiveRegionHtml from './html-examples/wrong-live-region.html?raw';

type Story = StoryFn<typeof Alert>;

const meta: Meta = {
  title: 'Komponenter/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Preview: Story = (args) => <Alert {...args}></Alert>;

Preview.args = {
  children: 'En beskjed det er viktig at brukeren ser',
  'data-color': 'info',
};

export const VariantInfo: Story = (args) => (
  <Alert {...args} data-color='info'>
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

export const VariantSuccess: Story = (args) => (
  <Alert {...args} data-color='success'>
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

export const VariantWarning: Story = (args) => (
  <Alert {...args} data-color='warning'>
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

export const VariantDanger: Story = (args) => (
  <Alert {...args} data-color='danger'>
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

export const MedHeading: Story = (args) => (
  <Alert {...args}>
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

export const MedKunHeading: Story = (args) => (
  <Alert {...args} data-color='warning'>
    <Paragraph> Du har 7 dager igjen på å fullføre søknaden.</Paragraph>
  </Alert>
);

export const MedLenke: Story = (args) => (
  <Alert {...args} data-color='warning'>
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

export const UtenAria: Story = (args) => (
  <Alert {...args} data-color='warning'>
    <Heading
      level={2}
      data-size='xs'
      style={{
        marginBottom: 'var(--ds-size-2)',
      }}
    >
      Nedetid
    </Heading>
    <Paragraph>
      I natt klokken 00:00 til 02:00 vil nettsiden være nede på grunn av
      vedlikehold.
    </Paragraph>
  </Alert>
);

export const WrongLiveRegionReact: StoryFn<typeof Alert> = () => {
  const [showAlert, setShowAlert] = useState(false);
  return (
    <>
      {showAlert && (
        <Alert
          data-color='warning'
          // Feil bruk: role="alert" ligger på selve varselet
          role='alert'
        >
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
            Vi har mistet forbindelsen med serveren og får ikke lagret skjemaet.
            Vent litt og prøv en gang til.
          </Paragraph>
        </Alert>
      )}
      <Button
        data-size='sm'
        variant='secondary'
        onClick={() => setShowAlert((value) => !value)}
      >
        {showAlert ? 'Skjul varsel' : 'Handling som fører til varsel'}
      </Button>
    </>
  );
};
WrongLiveRegionReact.parameters = {
  docs: {
    source: {
      // Ensure we show the actual code, and not the initially rendered output
      type: 'code',
      transform: formatReactSource,
    },
  },
  customStyles: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--ds-size-2)',
    alignItems: 'start',
  },
};

export const WrongLiveRegionHtml = createHtmlStory(wrongLiveRegionHtml, {
  customStyles: WrongLiveRegionReact.parameters.customStyles,
});

export const CorrectLiveRegionReact: StoryFn<typeof Alert> = () => {
  const [showAlert, setShowAlert] = useState(false);
  return (
    <>
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
      <Button
        data-size='sm'
        variant='secondary'
        onClick={() => setShowAlert((value) => !value)}
      >
        {showAlert ? 'Skjul varsel' : 'Handling som fører til varsel'}
      </Button>
    </>
  );
};
CorrectLiveRegionReact.parameters = WrongLiveRegionReact.parameters;

export const CorrectLiveRegionHtml = createHtmlStory(correctLiveRegionHtml, {
  customStyles: CorrectLiveRegionReact.parameters.customStyles,
});

export const MedAria: Story = (args) => (
  <Alert {...args} data-color='danger' role='alert'>
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
      Vi har mistet forbindelsen med serveren og får ikke lagret skjemaet. Vent
      litt og prøv en gang til.
    </Paragraph>
  </Alert>
);
