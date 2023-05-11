import React, { useState } from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import AccordionContent from './AccordionContent';
import AccordionHeader from './AccordionHeader';
import AccordionItem from './AccordionItem';

import { Accordion } from '.';

type Story = StoryObj<typeof Accordion>;

export default {
  title: 'Kjernekomponenter/Accordion',
  component: Accordion,
  subcomponents: {
    AccordionItem,
    AccordionContent,
    AccordionHeader,
  },
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta;

const Content = () => (
  <Accordion.Content>
    Magna aliquip aliquip fugiat nostrud nostrud velit pariatur veniam officia
    laboris voluptate officia pariatur. <a href='#Lorem'>Lorem est</a> ex anim
    velit occaecat nisi qui nostrud sit consectetur consectetur officia nostrud
    ullamco.
  </Accordion.Content>
);

export const props: Story = {
  args: {
    children: (
      <>
        <Accordion.Item>
          <Accordion.Header>Accordion header text</Accordion.Header>
          <Accordion.Content>
            Magna aliquip aliquip fugiat nostrud nostrud velit pariatur veniam
            officia laboris voluptate officia pariatur.
            <a href='#Lorem'>Lorem est</a> ex anim velit occaecat nisi qui
            nostrud sit consectetur consectetur officia nostrud ullamco.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header>Accordion header text</Accordion.Header>
          <Accordion.Content>
            Magna aliquip aliquip fugiat nostrud nostrud velit pariatur veniam
            officia laboris voluptate officia pariatur.{' '}
            <a href='#Lorem'>Lorem est</a> ex anim velit occaecat nisi qui
            nostrud sit consectetur consectetur officia nostrud ullamco.
          </Accordion.Content>
        </Accordion.Item>
      </>
    ),
    style: { width: '300px' },
  },
};

export const Controlled: StoryFn = () => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  return (
    <div style={{ width: 300 }}>
      <Accordion>
        <Accordion.Item open={open}>
          <Accordion.Header
            onHeaderClick={() => setOpen(!open)}
            level={3}
          >
            Accordion header text
          </Accordion.Header>
          <Content />
        </Accordion.Item>
        <Accordion.Item open={open2}>
          <Accordion.Header
            onHeaderClick={() => setOpen2(!open2)}
            level={3}
          >
            Accordion header text
          </Accordion.Header>
          <Content />
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export const Uncontrolled: StoryFn = () => (
  <div style={{ width: 300 }}>
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
