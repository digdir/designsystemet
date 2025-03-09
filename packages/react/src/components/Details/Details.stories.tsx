import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { Button, Card, Details, Link, Paragraph } from '../';

export default {
  title: 'Komponenter/Details',
  component: Details,
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const Preview: StoryFn<typeof Details> = (args) => (
  <Details {...args}>
    <Details.Summary>
      Hvem kan registrere seg i Frivillighetsregisteret?
    </Details.Summary>
    <Details.Content>
      For å kunne bli registrert i Frivillighetsregisteret, må organisasjonen
      drive frivillig virksomhet. Det er bare foreninger, stiftelser og
      aksjeselskap som kan registreres. Virksomheten kan ikke dele ut midler til
      fysiske personer. Virksomheten må ha et styre.
    </Details.Content>
  </Details>
);

export const InCard: StoryFn<typeof Details> = () => (
  <Card data-color='neutral'>
    <Details>
      <Details.Summary>Vedlegg</Details.Summary>
      <Details.Content>Vedlegg 1, vedlegg 2, vedlegg 3</Details.Content>
    </Details>
  </Card>
);

export const InCardWithColor: StoryFn<typeof Details> = () => (
  <>
    <Card data-color='accent'>
      <Details>
        <Details.Summary>
          Hvordan får jeg tildelt et jegernummer?
        </Details.Summary>
        <Details.Content>
          Du vil automatisk få tildelt jegernummer og bli registrert i
          Jegerregisteret når du har bestått jegerprøven.
        </Details.Content>
      </Details>
      <Details>
        <Details.Summary>
          Jeg har glemt jegernummeret mitt. Hvor finner jeg dette?
        </Details.Summary>
        <Details.Content>
          <Paragraph>
            Du kan finne dette ved å logge inn på{' '}
            <Link href='https://minjegerside.brreg.no/'>Min side</Link>
          </Paragraph>
        </Details.Content>
      </Details>
    </Card>
    <br />
    <Card data-color='accent' variant='tinted'>
      <Details>
        <Details.Summary>
          Hvordan får jeg tildelt et jegernummer?
        </Details.Summary>
        <Details.Content>
          Du vil automatisk få tildelt jegernummer og bli registrert i
          Jegerregisteret når du har bestått jegerprøven.
        </Details.Content>
      </Details>
      <Details>
        <Details.Summary>
          Jeg har glemt jegernummeret mitt. Hvor finner jeg dette?
        </Details.Summary>
        <Details.Content>
          <Paragraph>
            Du kan finne dette ved å logge inn på{' '}
            <Link href='https://minjegerside.brreg.no/'>Min side</Link>
          </Paragraph>
        </Details.Content>
      </Details>
    </Card>
  </>
);

export const Controlled: StoryFn<typeof Details> = () => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const toggleOpen = () => {
    const isOpen = [open1, open2, open3].every(Boolean);
    setOpen1(!isOpen);
    setOpen2(!isOpen);
    setOpen3(!isOpen);
  };

  return (
    <>
      <Button onClick={toggleOpen}>Toggle Details</Button>
      <br />
      <>
        <Details open={open1} onToggle={() => setOpen1(!open1)}>
          <Details.Summary>Enkeltpersonforetak</Details.Summary>
          <Details.Content>
            Skal du starte for deg selv? Enkeltpersonforetak er ofte den
            enkleste måten å etablere bedrift på. Denne organisasjonsformen har
            både fordeler og ulemper. Det gir deg stor grad av frihet, men kan
            også gi betydelig risiko fordi du har personlig ansvar for
            økonomien.
          </Details.Content>
        </Details>
        <Details open={open2} onToggle={() => setOpen2(!open2)}>
          <Details.Summary>Aksjeselskap (AS)</Details.Summary>
          <Details.Content>
            Planlegger du å starte næringsvirksomhet alene eller sammen med
            andre? Innebærer næringsvirksomheten en økonomisk risiko? Vil du ha
            rettigheter som arbeidstaker og muligheten til at andre kan
            investere i selskapet ditt? Da kan aksjeselskap være en
            hensiktsmessig organisasjonsform.
          </Details.Content>
        </Details>
        <Details open={open3} onToggle={() => setOpen3(!open3)}>
          <Details.Summary>Ansvarlig selskap (ANS/DA)</Details.Summary>
          <Details.Content>
            Er dere minst to personer som skal starte opp egen virksomhet?
            Samarbeider du godt med den/de som du skal starte opp sammen med?
            Krever virksomheten få investeringer og tar du liten økonomisk
            risiko? Da kan du vurdere å etablere et ansvarlig selskap.
          </Details.Content>
        </Details>
      </>
    </>
  );
};
