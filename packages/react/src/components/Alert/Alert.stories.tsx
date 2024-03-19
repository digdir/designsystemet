import type { Meta, StoryFn } from '@storybook/react';

import { Heading, Paragraph, Link } from '../';

import { Alert } from '.';

type Story = StoryFn<typeof Alert>;

export default {
  title: 'Komponenter/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const Preview: Story = (args) => <Alert {...args}></Alert>;

Preview.args = {
  severity: 'info',
  elevated: false,
  children: 'En beskjed det er viktig at brukeren ser',
};

export const VariantInfo: Story = () => (
  <Alert severity='info'>
    <Heading
      level={2}
      size='xsmall'
      spacing
    >
      Har du husket å bestille passtime?
    </Heading>
    <Paragraph>
      Det er lange køer for å bestille pass om dagen, det kan være lurt å
      bestille i god tid før du skal reise.
    </Paragraph>
  </Alert>
);

export const VariantSuccess: Story = () => (
  <Alert severity='success'>
    <Heading
      level={2}
      size='xsmall'
      spacing
    >
      Gratulerer! Du kan nå starte selskapet ditt
    </Heading>
    <Paragraph>
      Det ser ut til at regnestykket går i pluss og at du har det som skal til
      for å starte selskapet ditt.
    </Paragraph>
  </Alert>
);

export const VariantWarning: Story = () => (
  <Alert severity='warning'>
    <Heading
      level={2}
      size='xsmall'
      spacing
    >
      Vi har tekniske problemer
    </Heading>
    <Paragraph>
      Det gjør at du kan bli avbrutt mens du fyller ut skjemaet. Vi jobber med å
      rette problemene.
    </Paragraph>
  </Alert>
);

export const VariantDanger: Story = () => (
  <Alert severity='danger'>
    <Heading
      level={2}
      size='xsmall'
      spacing
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

export const MedHeading: Story = () => (
  <Alert>
    <Heading
      level={2}
      size='xsmall'
      spacing
    >
      Har du husket å bestille passtime?
    </Heading>
    <Paragraph>
      Det er lange køer for å bestille pass om dagen, det kan være lurt å
      bestille i god tid om du trenger pass til sommeren.
    </Paragraph>
  </Alert>
);

export const MedKunHeading: Story = () => (
  <Alert severity='warning'>
    <Paragraph> Du har 7 dager igjen på å fullføre søknaden.</Paragraph>
  </Alert>
);

export const MedLenke: Story = () => (
  <Alert severity='warning'>
    <Heading
      level={2}
      size='xsmall'
      spacing
    >
      Søknadsfristen går ut om 3 dager
    </Heading>
    <Paragraph>
      Fristen for å søke opptak til utdanning er 15. april.{' '}
      <Link href='https://designsystemet.no/'>Søk nå</Link>
    </Paragraph>
  </Alert>
);

export const MedShadow: Story = () => (
  <Alert
    elevated
    severity='success'
  >
    <Paragraph>Skjemaet er lagret automatisk.</Paragraph>
  </Alert>
);

export const UtenAria: Story = () => (
  <Alert severity='warning'>
    <Heading
      level={2}
      size='xsmall'
      spacing
    >
      Nedetid
    </Heading>
    <Paragraph>
      I natt klokken 00:00 til 02:00 vil nettsiden være nede på grunn av
      vedlikehold.
    </Paragraph>
  </Alert>
);

export const MedAria: Story = () => (
  <Alert severity='danger'>
    <Heading
      level={2}
      size='xsmall'
      spacing
      role='alert'
    >
      Vi klarer ikke lagre skjemaet
    </Heading>
    <Paragraph>
      Vi har mistet forbindelsen med serveren og får ikke lagret skjemaet. Vent
      litt og prøv en gang til.
    </Paragraph>
  </Alert>
);
