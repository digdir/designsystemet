import type { Meta, StoryObj, StoryFn } from '@storybook/react';

import { Paragraph, Heading } from '../Typography';
import { Button } from '../Button';

import { Skeleton } from '.';

type Story = StoryObj<typeof Skeleton.Rectangle>;

export default {
  title: 'Komponenter/Loaders/Skeleton',
  component: Skeleton.Rectangle,
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
      <Skeleton.Circle
        width='50px'
        height='50px'
      />
      <Skeleton.Rectangle
        width='100px'
        height='50px'
      />
      <Skeleton.Text
        width='50px'
        height='16px'
      />
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
      <Skeleton.Rectangle
        width='100%'
        height='150px'
      />
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          padding: '5px 0 5px 0',
        }}
      >
        <Skeleton.Circle
          width='30px'
          height='30px'
        />
        <Heading
          asChild
          size='md'
        >
          <Skeleton.Text>En medium tittel</Skeleton.Text>
        </Heading>
      </div>
      <Skeleton.Text width='100%' />
      <Skeleton.Text width='100%' />
      <Skeleton.Text width='80%' />
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
      <Heading
        size='large'
        asChild
      >
        <Skeleton.Text>Her er en heading</Skeleton.Text>
      </Heading>
      <Paragraph asChild>
        <Skeleton.Text>
          Her er en paragraf-komponent som blir rendret som en Skeleton.Text.
        </Skeleton.Text>
      </Paragraph>
      <Paragraph asChild>
        <Skeleton.Text>
          Se hvordan Skeleton da overskriver stylingen til det enkelte
          elementet.
        </Skeleton.Text>
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
          <Paragraph size='small'>
            Her er en paragraf som går over flere linjer
          </Paragraph>
        </div>
        <div style={{ width: '140px' }}>
          <Heading
            size='md'
            asChild
          >
            <Skeleton.Text>Heading</Skeleton.Text>
          </Heading>
          <Paragraph size='small'>
            <Skeleton.Text width='100%' />

            <Skeleton.Text width='100%' />
            <Skeleton.Text width='40%' />
          </Paragraph>
        </div>
      </div>
    </>
  );
};
