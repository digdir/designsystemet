import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Accordion } from '.';

export default {
  title: 'Kjernekomponenter/Accordion',
  component: Accordion,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
    layout: 'padded',
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

export const Preview: StoryFn<typeof Accordion> = (args) => (
  <Accordion {...args}>
    <Accordion.Item>
      <Accordion.Header>Accordion header text</Accordion.Header>
      <Accordion.Content>
        Magna aliquip aliquip fugiat nostrud nostrud velit pariatur veniam
        officia laboris voluptate officia pariatur.
        <a href='#Lorem'>Lorem est</a> ex anim velit occaecat nisi qui nostrud
        sit consectetur consectetur officia nostrud ullamco.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Header>Accordion header text</Accordion.Header>
      <Accordion.Content>
        Magna aliquip aliquip fugiat nostrud nostrud velit pariatur veniam
        officia laboris voluptate officia pariatur.{' '}
        <a href='#Lorem'>Lorem est</a> ex anim velit occaecat nisi qui nostrud
        sit consectetur consectetur officia nostrud ullamco.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
);

Preview.args = { border: false };

export const Controlled: StoryFn<typeof Accordion> = () => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  return (
    <div>
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

export const Uncontrolled: StoryFn<typeof Accordion> = (args) => (
  <Accordion {...args}>
    <Accordion.Item>
      <Accordion.Header>Accordion header text</Accordion.Header>
      <Content />
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Header>Accordion header text</Accordion.Header>
      <Content />
    </Accordion.Item>
  </Accordion>
);
