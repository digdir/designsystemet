import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import AccordionContent from './AccordionContent';
import AccordionHeader from './AccordionHeader';
import AccordionItem from './AccordionItem';

import { Accordion } from '.';

export default {
  title: 'Kjernekomponenter/Accordion',
  component: Accordion,
  subcomponents: {
    AccordionItem,
    AccordionContent,
    AccordionHeader,
  },
} as Meta;

const Content = () => (
  <Accordion.Content>
    Magna aliquip aliquip fugiat nostrud nostrud velit pariatur veniam officia
    laboris voluptate officia pariatur. <a href='#Lorem'>Lorem est</a> ex anim
    velit occaecat nisi qui nostrud sit consectetur consectetur officia nostrud
    ullamco. Est ex duis proident nostrud elit qui laborum anim minim eu
    eiusmod. Veniam in nostrud sunt tempor velit incididunt sint ex dolor qui
    velit id eu. Deserunt magna sunt velit in. Est exercitation id cillum qui
    do. Minim adipisicing nostrud commodo proident occaecat aliquip nulla anim
    proident reprehenderit. Magna ipsum officia veniam cupidatat duis veniam
    dolore reprehenderit mollit velit. Ut consequat commodo minim occaecat id
    pariatur. Nisi enim tempor laborum commodo. Tempor sit quis nostrud eu
    cupidatat sunt commodo reprehenderit irure deserunt eiusmod ipsum.
    Exercitation quis commodo cillum eiusmod eiusmod. Do laborum qui proident
    commodo adipisicing eiusmod id.
  </Accordion.Content>
);

export const Controlled: StoryFn = () => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  return (
    <div style={{ width: 500 }}>
      <Accordion>
        <Accordion.Item open={open}>
          <Accordion.Header onHeaderClick={() => setOpen(!open)}>
            Accordion header text
          </Accordion.Header>
          <Content />
        </Accordion.Item>
        <Accordion.Item open={open2}>
          <Accordion.Header onHeaderClick={() => setOpen2(!open2)}>
            Accordion header text
          </Accordion.Header>
          <Content />
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export const Uncontrolled: StoryFn = () => (
  <div style={{ width: 500 }}>
    <Accordion>
      <Accordion.Item>
        <Accordion.Header>Accordion header text</Accordion.Header>
        <Content />
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>Accordion header text</Accordion.Header>
        <Content />
      </Accordion.Item>
    </Accordion>
  </div>
);

export const Border: StoryFn = () => (
  <div style={{ width: 500 }}>
    <Accordion border>
      <Accordion.Item>
        <Accordion.Header>Accordion header text</Accordion.Header>
        <Content />
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>Accordion header text</Accordion.Header>
        <Content />
      </Accordion.Item>
    </Accordion>
  </div>
);

export const ColorNeutral: StoryFn = () => (
  <div style={{ width: 500 }}>
    <Accordion
      border
      color='neutral'
    >
      <Accordion.Item>
        <Accordion.Header>Accordion header text</Accordion.Header>
        <Content />
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>Accordion header text</Accordion.Header>
        <Content />
      </Accordion.Item>
    </Accordion>
  </div>
);

export const ColorSubtle: StoryFn = () => (
  <div style={{ width: 500 }}>
    <Accordion
      border
      color='subtle'
    >
      <Accordion.Item>
        <Accordion.Header>Accordion header text</Accordion.Header>
        <Content />
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>Accordion header text</Accordion.Header>
        <Content />
      </Accordion.Item>
    </Accordion>
  </div>
);

export const ColorPrimary: StoryFn = () => (
  <div style={{ width: 500 }}>
    <Accordion color='primary'>
      <Accordion.Item>
        <Accordion.Header>Accordion header text</Accordion.Header>
        <Content />
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>Accordion header text</Accordion.Header>
        <Content />
      </Accordion.Item>
    </Accordion>
  </div>
);

export const ColorSecondary: StoryFn = () => (
  <div style={{ width: 500 }}>
    <Accordion
      border
      color='secondary'
    >
      <Accordion.Item>
        <Accordion.Header>Accordion header text</Accordion.Header>
        <Content />
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>Accordion header text</Accordion.Header>
        <Content />
      </Accordion.Item>
    </Accordion>
  </div>
);

export const ColorTertiary: StoryFn = () => (
  <div style={{ width: 500 }}>
    <Accordion
      border
      color='tertiary'
    >
      <Accordion.Item>
        <Accordion.Header>Accordion header text</Accordion.Header>
        <Content />
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>Accordion header text</Accordion.Header>
        <Content />
      </Accordion.Item>
    </Accordion>
  </div>
);
