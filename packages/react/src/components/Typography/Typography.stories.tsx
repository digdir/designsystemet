import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Paragraph, Heading, Ingress, Detail, Label, ErrorMessage } from './';

const meta: Meta = {
  title: 'Kjernekomponenter/Typography',
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
};

export default meta;

export const Ingresses: StoryFn<typeof Ingress> = () => (
  <>
    <Ingress size='large'>
      Her kan du registrere nye virksomheter, som for eksempel
      enkeltpersonforetak, foreninger, aksjeselskap, ansvarlige selskap,
      samvirkeforetak og stiftelser. De aller fleste organisasjonsformene kan
      bruke denne tjenesten.
    </Ingress>
    <Ingress>
      Her kan du registrere nye virksomheter, som for eksempel
      enkeltpersonforetak, foreninger, aksjeselskap, ansvarlige selskap,
      samvirkeforetak og stiftelser. De aller fleste organisasjonsformene kan
      bruke denne tjenesten.
    </Ingress>
  </>
);

export const Details: StoryFn<typeof Detail> = () => (
  <Detail>En eller annen viktig detalj</Detail>
);

export const Labels: StoryFn<typeof Label> = () => (
  <>
    <Label>Skriv inn fødselsnummer. 11 tegn</Label>
    <Label size='small'>Skriv inn fødselsnummer. 11 tegn</Label>
  </>
);

export const ErrorMessages: StoryFn<typeof ErrorMessage> = () => (
  <>
    <ErrorMessage>En eller annen feilmeldings tekst</ErrorMessage>
    <ErrorMessage size='small'>
      En eller annen liten feilmeldings tekst
    </ErrorMessage>
  </>
);

export const ExampleText: StoryFn = () => (
  <>
    <Heading
      level={1}
      size='xlarge'
      spacing
    >
      Samordnet registermelding (H1)
    </Heading>

    <Ingress>
      Her kan du registrere nye virksomheter, som for eksempel
      enkeltpersonforetak, foreninger, aksjeselskap, ansvarlige selskap,
      samvirkeforetak og stiftelser. De aller fleste organisasjonsformene kan
      bruke denne tjenesten.
    </Ingress>

    <Heading
      level={2}
      size='large'
      spacing
    >
      Når skal du bruke skjemaet? (H2)
    </Heading>

    <Paragraph>
      Denne tjenesten kan du bruke for å melde opplysninger til
      Enhetsregisteret, Foretaksregisteret, Frivillighetsregisteret, NAV
      Aa-registeret, Virksomhets- og foretaksregisteret hos SSB,
      Stiftelsesregisteret og Skattedirektoratets register over upersonlige
      skattytere.
    </Paragraph>

    <Heading
      level={3}
      size='medium'
    >
      Signering (H3)
    </Heading>

    <Paragraph short>
      Når du skal signere meldingen vil du motta en signeringsoppgave i
      meldingsboksen din i Altinn. Meldingen blir ikke sendt til behandling før
      alle har signert.
    </Paragraph>

    <Heading
      level={4}
      size='small'
    >
      Krav om rolle for signering (H4)
    </Heading>

    <Paragraph>
      For å signere på vegne av en virksomhet, trenger du Altinn-rollen Signerer
      av Samordnet registermelding. Du kan se hvilke roller du har for en aktør
      på menypunktet Profil, Skjema og tjenester du har rettighet til. Om du
      ikke har disse rollene, må du få noen som har rollene til å delegere dem
      til deg.
    </Paragraph>

    <Heading
      level={5}
      size='xsmall'
    >
      Personvern (H5)
    </Heading>

    <Paragraph short>
      Personvernerklæringen gir informasjon om hvilke personopplysninger vi
      behandler, hvordan disse blir behandlet og hvilke rettigheter du har.
    </Paragraph>
  </>
);
