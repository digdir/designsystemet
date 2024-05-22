import type { Meta, StoryFn } from '@storybook/react';

import { Paragraph, Heading, Ingress } from './';

const meta: Meta = {
  title: 'Komponenter/Typography',
};

export default meta;

export const EksempelTekst: StoryFn = () => (
  <>
    <Heading
      level={1}
      size='xl'
      spacing
    >
      Samordnet registermelding (H1)
    </Heading>

    <Ingress spacing>
      Her kan du registrere nye virksomheter, som for eksempel
      enkeltpersonforetak, foreninger, aksjeselskap, ansvarlige selskap,
      samvirkeforetak og stiftelser. De aller fleste organisasjonsformene kan
      bruke denne tjenesten.
    </Ingress>

    <Heading
      level={2}
      size='lg'
      spacing
    >
      Når skal du bruke skjemaet? (H2)
    </Heading>

    <Paragraph spacing>
      Denne tjenesten kan du bruke for å melde opplysninger til
      Enhetsregisteret, Foretaksregisteret, Frivillighetsregisteret, NAV
      Aa-registeret, Virksomhets- og foretaksregisteret hos SSB,
      Stiftelsesregisteret og Skattedirektoratets register over upersonlige
      skattytere.
    </Paragraph>

    <Heading
      level={3}
      size='md'
      spacing
    >
      Signering (H3)
    </Heading>

    <Paragraph
      variant='short'
      spacing
    >
      Når du skal signere meldingen vil du motta en signeringsoppgave i
      meldingsboksen din i Altinn. Meldingen blir ikke sendt til behandling før
      alle har signert.
    </Paragraph>

    <Heading
      level={4}
      size='sm'
      spacing
    >
      Krav om rolle for signering (H4)
    </Heading>

    <Paragraph spacing>
      For å signere på vegne av en virksomhet, trenger du Altinn-rollen Signerer
      av Samordnet registermelding. Du kan se hvilke roller du har for en aktør
      på menypunktet Profil, Skjema og tjenester du har rettighet til. Om du
      ikke har disse rollene, må du få noen som har rollene til å delegere dem
      til deg.
    </Paragraph>

    <Heading
      level={5}
      size='xs'
      spacing
    >
      Personvern (H5)
    </Heading>

    <Paragraph
      variant='short'
      spacing
    >
      Personvernerklæringen gir informasjon om hvilke personopplysninger vi
      behandler, hvordan disse blir behandlet og hvilke rettigheter du har.
    </Paragraph>
  </>
);
