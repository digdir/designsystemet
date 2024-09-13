import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { Button, Link } from '../';

import { Accordion } from '.';

export default {
  title: 'Komponenter/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const Preview: StoryFn<typeof Accordion> = (args) => (
  <Accordion {...args}>
    <Accordion.Item>
      <Accordion.Heading>
        Hvem kan registrere seg i Frivillighetsregisteret?
      </Accordion.Heading>
      <Accordion.Content>
        For å kunne bli registrert i Frivillighetsregisteret, må organisasjonen
        drive frivillig virksomhet. Det er bare foreninger, stiftelser og
        aksjeselskap som kan registreres. Virksomheten kan ikke dele ut midler
        til fysiske personer. Virksomheten må ha et styre.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Heading>
        Hvordan går jeg fram for å registrere i Frivillighetsregisteret?
      </Accordion.Heading>
      <Accordion.Content>
        Virksomheten må være registrert i Enhetsregisteret før den kan bli
        registrert i Frivillighetsregisteret. Du kan registrere i begge
        registrene samtidig i Samordnet registermelding.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
);

export const AccordionBorder: StoryFn<typeof Accordion> = () => (
  <Accordion border color='subtle'>
    <Accordion.Item>
      <Accordion.Heading>Vedlegg</Accordion.Heading>
      <Accordion.Content>Vedlegg 1, vedlegg 2, vedlegg 3</Accordion.Content>
    </Accordion.Item>
  </Accordion>
);

export const AccordionColor: StoryFn<typeof Accordion> = () => (
  <Accordion border color='brand2'>
    <Accordion.Item>
      <Accordion.Heading>
        Hvordan får jeg tildelt et jegernummer?
      </Accordion.Heading>
      <Accordion.Content>
        Du vil automatisk få tildelt jegernummer og bli registrert i
        Jegerregisteret når du har bestått jegerprøven.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Heading>
        Jeg har glemt jegernummeret mitt. Hvor finner jeg dette?
      </Accordion.Heading>
      <Accordion.Content>
        Du kan finne dette ved å logge inn på{' '}
        <Link href='https://minjegerside.brreg.no/'>Min jegerside</Link>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
);

// Default values are selected in Controls
Preview.args = {
  border: false,
  color: 'neutral',
};

export const Controlled: StoryFn<typeof Accordion> = () => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const toggleOpen = () => {
    setOpen1(!open1);
    setOpen2(!open1);
    setOpen3(!open1);
  };

  return (
    <>
      <Button onClick={toggleOpen}>Toggle Accordions</Button>
      <br />
      <Accordion>
        <Accordion.Item open={open1} onFound={() => setOpen1(true)}>
          <Accordion.Heading onClick={() => setOpen1(!open1)}>
            Enkeltpersonforetak
          </Accordion.Heading>
          <Accordion.Content>
            Skal du starte for deg selv? Enkeltpersonforetak er ofte den
            enkleste måten å etablere bedrift på. Denne organisasjonsformen har
            både fordeler og ulemper. Det gir deg stor grad av frihet, men kan
            også gi betydelig risiko fordi du har personlig ansvar for
            økonomien.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item open={open2} onFound={() => setOpen2(false)}>
          <Accordion.Heading onClick={() => setOpen2(!open2)}>
            Aksjeselskap (AS)
          </Accordion.Heading>
          <Accordion.Content>
            Planlegger du å starte næringsvirksomhet alene eller sammen med
            andre? Innebærer næringsvirksomheten en økonomisk risiko? Vil du ha
            rettigheter som arbeidstaker og muligheten til at andre kan
            investere i selskapet ditt? Da kan aksjeselskap være en
            hensiktsmessig organisasjonsform.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item open={open3} onFound={() => setOpen3(true)}>
          <Accordion.Heading onClick={() => setOpen3(!open3)}>
            Ansvarlig selskap (ANS/DA)
          </Accordion.Heading>
          <Accordion.Content>
            Er dere minst to personer som skal starte opp egen virksomhet?
            Samarbeider du godt med den/de som du skal starte opp sammen med?
            Krever virksomheten få investeringer og tar du liten økonomisk
            risiko? Da kan du vurdere å etablere et ansvarlig selskap.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </>
  );
};
