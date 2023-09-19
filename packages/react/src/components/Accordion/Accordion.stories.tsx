import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Accordion } from '.';

export default {
  title: 'Felles/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const Preview: StoryFn<typeof Accordion> = (args) => (
  <Accordion {...args}>
    <Accordion.Item>
      <Accordion.Header level={3}>Hva er Lorem Ipsum?</Accordion.Header>
      <Accordion.Content>
        Lorem Ipsum er rett og slett dummytekst fra og for trykkeindustrien.
        Lorem Ipsum har vært bransjens standard for dummytekst helt siden
        1500-tallet, da en ukjent boktrykker stokket en mengde bokstaver for å
        lage et prøveeksemplar av en bok.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Header level={3}>Hvor kommer det fra?</Accordion.Header>
      <Accordion.Content>
        I motsetning til hva mange tror, er ikke Lorem Ipsum bare tilfeldig
        tekst. Dets røtter springer helt tilbake til et stykke klassisk latinsk
        litteratur fra 45 år f.kr., hvilket gjør det over 2000 år gammelt.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
);

export const AccordionBorder: StoryFn<typeof Accordion> = (args) => (
  <Accordion
    border
    color='subtle'
  >
    <Accordion.Item>
      <Accordion.Header level={3}>Hva er Lorem Ipsum?</Accordion.Header>
      <Accordion.Content>
        Lorem Ipsum er rett og slett dummytekst fra og for trykkeindustrien.
        Lorem Ipsum har vært bransjens standard for dummytekst helt siden
        1500-tallet, da en ukjent boktrykker stokket en mengde bokstaver for å
        lage et prøveeksemplar av en bok.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
);

export const AccordionColor: StoryFn<typeof Accordion> = (args) => (
  <Accordion
    border
    color='secondary'
  >
    <Accordion.Item>
      <Accordion.Header level={3}>Hva er Lorem Ipsum?</Accordion.Header>
      <Accordion.Content>
        Lorem Ipsum er rett og slett dummytekst fra og for trykkeindustrien.
        Lorem Ipsum har vært bransjens standard for dummytekst helt siden
        1500-tallet, da en ukjent boktrykker stokket en mengde bokstaver for å
        lage et prøveeksemplar av en bok.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Header level={3}>Hvor kommer det fra?</Accordion.Header>
      <Accordion.Content>
        I motsetning til hva mange tror, er ikke Lorem Ipsum bare tilfeldig
        tekst. Dets røtter springer helt tilbake til et stykke klassisk latinsk
        litteratur fra 45 år f.kr., hvilket gjør det over 2000 år gammelt.
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
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  return (
    <Accordion>
      <Accordion.Item open={open}>
        <Accordion.Header onHeaderClick={() => setOpen(!open)}>
          Accordion header text
        </Accordion.Header>
        <Accordion.Content>Accordion content</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item open={open2}>
        <Accordion.Header onHeaderClick={() => setOpen2(!open2)}>
          Accordion header text
        </Accordion.Header>
        <Accordion.Content>Accordion content</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};
