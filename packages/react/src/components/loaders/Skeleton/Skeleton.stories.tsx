import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Button, Heading, Paragraph } from '../../';

import { Skeleton } from '.';

type Story = StoryObj<typeof Skeleton>;

export default {
  title: 'Komponenter/Loaders/Skeleton',
  component: Skeleton,
} as Meta;

export const Preview: Story = {
  args: {
    width: '200px',
    height: '100px',
  },
};

export const Components: StoryFn<typeof Text> = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      <Skeleton variant='circle' width='50px' height='50px' />
      <Skeleton variant='rectangle' width='100px' height='50px' />
      <Skeleton variant='text' width='50px' height='16px' />
    </div>
  );
};

export const UsageExample: StoryFn<typeof Skeleton> = () => {
  return (
    <div
      style={{
        width: '400px',
      }}
    >
      <Skeleton height='150px' />
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          padding: '5px 0 5px 0',
        }}
      >
        <Skeleton variant='circle' width='30px' height='30px' />
        <Heading asChild size='md'>
          <Skeleton variant='text'>En medium tittel</Skeleton>
        </Heading>
      </div>
      <Skeleton variant='text' />
      <Skeleton variant='text' />
      <Skeleton variant='text' width='80%' />
    </div>
  );
};

export const Children: StoryFn<typeof Skeleton> = () => {
  return (
    <Skeleton variant='rectangle'>
      <Paragraph>
        Her er en tekst som blir sendt inn som barn av en Skeleton.
      </Paragraph>
      <Paragraph>
        Se hvordan Skeleton da dekker den samlede bredden og høyden til barna.
      </Paragraph>
      <Button>Knapp</Button>
    </Skeleton>
  );
};

export const As: StoryFn<typeof Skeleton> = () => {
  return (
    <>
      <Heading size='lg' asChild>
        <Skeleton variant='text'>Her er en heading</Skeleton>
      </Heading>
      <Paragraph asChild>
        <Skeleton variant='text'>
          Her er en paragraf-komponent som blir rendret som en Skeleton
          variant="text".
        </Skeleton>
      </Paragraph>
      <Paragraph asChild>
        <Skeleton variant='text'>
          Se hvordan Skeleton da overskriver stylingen til det enkelte
          elementet.
        </Skeleton>
      </Paragraph>
    </>
  );
};

export const TextExample: StoryFn<typeof Text> = () => {
  return (
    <>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ width: '140px' }}>
          <Heading size='md'>Heading</Heading>
          <Paragraph size='sm'>
            Her er en paragraf som går over flere linjer
          </Paragraph>
        </div>
        <div style={{ width: '140px' }}>
          <Heading size='md' asChild>
            <Skeleton variant='text'>Heading</Skeleton>
          </Heading>
          <Paragraph size='sm'>
            <Skeleton variant='text' />
            <Skeleton variant='text' />
            <Skeleton variant='text' width={80} />
          </Paragraph>
        </div>
      </div>
    </>
  );
};
