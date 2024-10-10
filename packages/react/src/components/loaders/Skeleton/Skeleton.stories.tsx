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
      <Skeleton variant='text' width='10' />
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

export const As: StoryFn<typeof Skeleton> = () => {
  return (
    <>
      <Heading size='lg'>
        <Skeleton variant='text'>Her er en heading</Skeleton>
      </Heading>
      <Paragraph>
        <Skeleton variant='text'>
          Her er en paragraf-komponent som blir rendret som en Skeleton
          variant="text".
        </Skeleton>
      </Paragraph>
      <Paragraph>
        <Skeleton variant='text'>
          Se hvordan Skeleton da overskriver stylingen til det enkelte
          elementet.
        </Skeleton>
      </Paragraph>
    </>
  );
};

export const TextExample: StoryFn<typeof Text> = () => (
  <div style={{ display: 'flex', gap: '20px', maxWidth: 300 }}>
    <div>
      <Heading size='md'>Heading</Heading>
      <Paragraph size='sm'>
        Her er en paragraf som går over flere linjer
      </Paragraph>
    </div>
    <div>
      <Heading size='md'>
        <Skeleton variant='text'>Heading</Skeleton>
      </Heading>
      <Paragraph size='sm'>
        <Skeleton variant='text' width={40} />
      </Paragraph>
    </div>
  </div>
);
