import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Typeset } from '@storybook/blocks';

import { Text as Paragraph, Heading } from './';

const meta: Meta = {
  title: 'Kjernekomponenter/Typography',
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
};

export default meta;

export const Headings: StoryFn = () => (
  <>
    <Heading
      level={1}
      size='xlarge'
    >
      Tittel 1 xlarge
    </Heading>
    <Heading
      level={2}
      size='large'
    >
      Tittel 2 large
    </Heading>
    <Heading
      level={3}
      size='medium'
    >
      Tittel 3 medium
    </Heading>
    <Heading
      level={4}
      size='small'
    >
      Tittel 4 small
    </Heading>
    <Heading
      level={5}
      size='xsmall'
    >
      Tittel 5 xsmall
    </Heading>
    <Heading
      level={6}
      size='xsmall'
    >
      Tittel 6 xsmall
    </Heading>
  </>
);

export const Texts: StoryFn = () => (
  <>
    <Paragraph
      size='medium'
      as='span'
      short
    >
      Tekst Medium
    </Paragraph>
    <Paragraph size='small'>Tekst Small</Paragraph>

    <Paragraph
      size='medium'
      short
    >
      Tekst Medium
    </Paragraph>
    <Paragraph
      size='small'
      short
    >
      Tekst Small
    </Paragraph>
  </>
);
