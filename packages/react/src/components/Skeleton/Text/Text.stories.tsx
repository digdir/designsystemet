import React from 'react';
import type { Meta, StoryObj, StoryFn } from '@storybook/react';

import { Paragraph, Heading } from '../../Typography';

import { Text } from './Text';

type Story = StoryObj<typeof Text>;

export default {
  title: 'Felles/Skeleton/Text',
  component: Text,
} as Meta;

export const Preview: Story = {
  args: {
    width: '100px',
  },
};

export const TextExample: StoryFn<typeof Text> = () => {
  return (
    <>
      <Heading
        size='large'
        style={{ display: 'flex', gap: '59px', width: '200px' }}
      >
        <Text width='50px' />{' '}
        <span style={{ backgroundColor: 'white' }}>Haj</span>
      </Heading>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Paragraph
          size='small'
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <Text width='100px' />

          <Text width='100px' />
          <Text width='90px' />
        </Paragraph>
        <Paragraph
          size='small'
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <span style={{ width: '100px' }}>
            Haj på deg Haj på meg Haj på sei{' '}
          </span>
        </Paragraph>
      </div>
    </>
  );
};
