import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Stack } from '../../../../../docs-components';
import { Heading, Paragraph } from '../';

import { Alert } from '.';

export default {
  title: 'Kjernekomponenter/Alert',
  component: Alert,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
    layout: 'padded',
  },
} as Meta;

export const Preview: StoryFn<typeof Alert> = (args) => (
  <Alert {...args}>
    <Heading
      level={2}
      size='xsmall'
      spacing
    >
      Har du husket å bestille passtime?
    </Heading>
    Det er lange køer for å bestille pass om dagen, det kan være lurt å bestille
    i god tid om du trenger pass til sommeren.
  </Alert>
);

Preview.args = {
  severity: 'info',
  elevated: false,
};

export const Eksempler: StoryFn<typeof Alert> = () => (
  <>
    <Alert severity='success'>
      <Paragraph short>Skjema er lagret automatisk</Paragraph>
    </Alert>
    <Alert severity='success'>
      <Paragraph short>
        Det ser ut til at regnestykket ditt går i pluss og at du har det som
        skal til for å lykkes i oppstartsfasen av ditt selskap.
      </Paragraph>
    </Alert>
    <Alert severity='danger'>
      <Heading
        level={2}
        size='xsmall'
        spacing
      >
        Beklager, men det har skjedd en feil
      </Heading>
      <Paragraph>
        Vi klarer ikke å hente informasjonen du ser etter akkurat nå. Prøv igjen
        litt senere. Om vi fortsatt ikke klarer å vise informasjonen, ta kontakt
        med kundeservice.
      </Paragraph>
    </Alert>
    <Alert severity='warning'>
      <Heading
        level={2}
        size='xsmall'
        spacing
      >
        Du blir snart logget ut
      </Heading>
      <Paragraph>
        Du har nå vært inaktiv i 15 minutter og vil bli automatisk logget ut om
        du ikke foretar deg noe på innen 5 minutter.
      </Paragraph>
    </Alert>
    <Alert severity='warning'>
      <Heading
        level={2}
        size='xsmall'
      >
        Du blir snart logget ut
      </Heading>
    </Alert>
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
  </>
);

Eksempler.decorators = [
  (Story) => (
    <Stack style={{ justifyContent: 'start' }}>
      <Story />
    </Stack>
  ),
];
