import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Button, Heading, Paragraph } from '../../';

import { Skeleton } from '.';

type Story = StoryObj<typeof Skeleton>;

export default {
  title: 'Komponenter/Loaders/Skeleton',
  component: Skeleton,
  parameters: {
    a11y: {
      config: {
        // Disable a11y empty heading rule as we intentionally set aria-hidden="true" on the Skeleton component inside Headings
        rules: [{ id: 'empty-heading', selector: ':has(.ds-skeleton)' }],
      },
    },
  },
} as Meta;

export const Preview: Story = {
  args: {
    width: 200,
    height: 100,
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
      <Paragraph>
        <Skeleton variant='text' width='10' />
      </Paragraph>
    </div>
  );
};

export const UsageExample: StoryFn<typeof Skeleton> = () => {
  return (
    <div
      style={{
        maxWidth: 400,
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
        <Heading size='md'>
          <Skeleton variant='text'>En medium tittel</Skeleton>
        </Heading>
      </div>
      <Skeleton variant='text' width='140' />
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

export const Text: StoryFn<typeof Skeleton> = () => (
  <div style={{ display: 'flex', gap: '20px', maxWidth: 300 }}>
    <div style={{ flex: '1 1 200px' }}>
      <Heading size='md'>En tittel</Heading>
      <Paragraph size='sm'>
        Her er en paragraf som går over flere linjer
      </Paragraph>
    </div>
    <div style={{ flex: '1 1 200px' }}>
      <Heading size='md'>
        <Skeleton variant='text'>En tittel</Skeleton>
      </Heading>
      <Paragraph size='sm'>
        <Skeleton variant='text' width={40} />
      </Paragraph>
    </div>
  </div>
);
