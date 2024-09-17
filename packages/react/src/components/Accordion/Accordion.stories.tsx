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
        Hvem kan registrere seg i Frivillighetsregisteret? X
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
        <p style={{ marginTop: 0 }}>
          Du kan finne dette ved å logge inn på{' '}
          <Link href='https://minjegerside.brreg.no/'>Min side</Link>
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu
          orci nisi. Nulla sed sem eget odio pellentesque venenatis vitae et
          sem. Nunc vulputate nibh id nunc condimentum, et mattis quam vehicula.
          Praesent gravida turpis eget tincidunt sodales. Praesent ante arcu,
          semper at rhoncus ut, commodo ut ligula. Phasellus quis nibh vitae
          dolor faucibus dictum et dapibus justo. Morbi scelerisque sem id nisi
          ornare, in facilisis felis molestie.
        </p>
        <p>
          Vivamus maximus eget mi ut aliquam. Nulla facilisi. Sed lobortis, dui
          at facilisis scelerisque, tellus justo sodales enim, at luctus diam
          turpis id diam. Sed vel magna eget nulla ornare lacinia. Mauris
          commodo erat at dui interdum viverra. Morbi rhoncus dolor in massa
          vehicula, aliquam dictum tortor luctus. Quisque vel feugiat libero.
        </p>
        <p>
          Nullam sed quam vestibulum, scelerisque nisl vel, rhoncus leo. Integer
          eu tempor ex, in vulputate erat. Quisque nisl lectus, consequat sit
          amet ex ut, interdum tincidunt ligula. Morbi sed odio a leo bibendum
          hendrerit. Nullam erat nisi, convallis tincidunt tempor eu, iaculis
          scelerisque mauris. Nulla pretium ornare blandit. Proin dignissim
          massa risus, eget euismod enim lobortis at. Donec venenatis libero sed
          ligula convallis scelerisque. Pellentesque ut aliquet ante.
          Pellentesque et eleifend ex. Quisque posuere convallis urna et
          ullamcorper. Morbi eu tincidunt mauris. Ut nec diam nunc. Sed sed
          neque facilisis, luctus libero vitae, porttitor ex. Mauris euismod
          vitae velit eu laoreet.
        </p>
        <p>
          Vivamus maximus eget mi ut aliquam. Nulla facilisi. Sed lobortis, dui
          at facilisis scelerisque, tellus justo sodales enim, at luctus diam
          turpis id diam. Sed vel magna eget nulla ornare lacinia. Mauris
          commodo erat at dui interdum viverra. Morbi rhoncus dolor in massa
          vehicula, aliquam dictum tortor luctus. Quisque vel feugiat libero.
        </p>
        <p>
          Nullam sed quam vestibulum, scelerisque nisl vel, rhoncus leo. Integer
          eu tempor ex, in vulputate erat. Quisque nisl lectus, consequat sit
          amet ex ut, interdum tincidunt ligula. Morbi sed odio a leo bibendum
          hendrerit. Nullam erat nisi, convallis tincidunt tempor eu, iaculis
          scelerisque mauris. Nulla pretium ornare blandit. Proin dignissim
          massa risus, eget euismod enim lobortis at. Donec venenatis libero sed
          ligula convallis scelerisque. Pellentesque ut aliquet ante.
          Pellentesque et eleifend ex. Quisque posuere convallis urna et
          ullamcorper. Morbi eu tincidunt mauris. Ut nec diam nunc. Sed sed
          neque facilisis, luctus libero vitae, porttitor ex. Mauris euismod
          vitae velit eu laoreet.
        </p>
        <p style={{ marginBottom: 0 }}>
          Nulla facilisi. Maecenas vel fringilla felis. Sed orci felis, volutpat
          ac bibendum sit amet, sodales ac purus. Fusce nisi eros, tristique sed
          consequat sed, scelerisque et tortor. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Vestibulum pellentesque vehicula orci sed
          scelerisque. Ut nec elementum tortor. Praesent lobortis eros nec
          laoreet iaculis. Pellentesque ex purus, vulputate non volutpat non,
          sodales a arcu. Phasellus ornare, lorem nec aliquam venenatis, augue
          eros sagittis quam, at sagittis tellus ante in metus.
        </p>
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
