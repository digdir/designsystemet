import React from 'react';
import type { Meta, StoryObj, StoryFn } from '@storybook/react';

import { Paragraph, Heading, Ingress } from '../Typography';
import { Button } from '../Button';

import { Skeleton } from '.';

type Story = StoryObj<typeof Skeleton.Circle>;

export default {
  title: 'Felles/Skeleton',
  component: Skeleton.Circle,
} as Meta;

export const Preview: Story = {
  args: {
    width: '100px',
    height: '100px',
  },
};

export const Other: StoryFn<typeof Skeleton> = () => {
  return (
    <div
      style={{
        fontSize: '16px',
        display: 'flex',
        flexDirection: 'column',
        width: '400px',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: '3rem',
          gap: '10px',
          paddingBottom: '5px',
        }}
      >
        <Skeleton.Circle />
        <Skeleton.Rectangle width='90%' />
      </div>
      <Skeleton.Text />
      <Skeleton.Text />
      <Skeleton.Text />
    </div>
  );
};

export const Children: StoryFn<typeof Skeleton> = () => {
  return (
    <>
      <Skeleton.Text>
        <Paragraph>
          Her er en tekst som blir sendt inn som barn av en Skeleton.Text.
        </Paragraph>
        <Paragraph>
          Se hvordan Skeleton da dekker den samlede bredden og høyden til barna.
        </Paragraph>
        <Button>Knapp</Button>
      </Skeleton.Text>
    </>
  );
};

export const As: StoryFn<typeof Skeleton> = () => {
  return (
    <>
      <Ingress
        size='medium'
        as={Skeleton.Text}
      >
        Her er en heading
      </Ingress>
      <Paragraph as={Skeleton.Text}>
        Her er en paragraf som blir rendret som en Skeleton.Text.
      </Paragraph>
      <Paragraph size='medium'>
        <Skeleton.Text width='500px' />
      </Paragraph>
      <Paragraph as={Skeleton.Text}>
        Se hvordan Skeleton da tilpasser seg etter det enkelte elementet den
        dekker.
      </Paragraph>
      <Button as={Skeleton.Rectangle}>Knapp</Button>
    </>
  );
};
