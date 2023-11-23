import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import media from '../../../../../assets/img/card-media.png';
import { Heading, Paragraph } from '../Typography';
import { Stack } from '../../../../../docs-components';
import { Divider } from '../..';

import { Card } from '.';

type Story = StoryFn<typeof Card>;

export default {
  title: 'Felles/Card',
  component: Card,
} as Meta;

const CatImage: JSX.Element = (
  <img
    src={media as string}
    alt='cat'
  />
);

export const Preview: Story = (args) => (
  <Card {...args}>
    <Card.Header>
      <div>
        <Heading size='small'>Card Neutral</Heading>
        <Paragraph size='small'>Subtitle bottom</Paragraph>
      </div>
    </Card.Header>
    <Card.Content>
      Most provide as with carried business are much better more the perfected
      designer. Writing slightly explain desk unable at supposedly about this
    </Card.Content>
    <Card.Footer>
      <Paragraph size='small'>Footer text</Paragraph>
    </Card.Footer>
  </Card>
);

Preview.args = {
  color: 'neutral',
};

export const Variants: StoryFn<typeof Card> = () => {
  return (
    <>
      <Card
        color='neutral'
        MediaImage={CatImage}
      >
        <Card.Header>
          <div>
            <Heading
              level={3}
              size='small'
            >
              Card Neutral
            </Heading>
            <Paragraph size='small'>Subtitle bottom</Paragraph>
          </div>
        </Card.Header>
        <Card.Content>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Card.Content>
      </Card>
      <Card
        color='subtle'
        MediaImage={CatImage}
      >
        <Card.Header>
          <div>
            <Heading
              level={3}
              size='small'
            >
              Card Subtle
            </Heading>
            <Paragraph
              style={{ color: 'var(--fds-semantic-text-neutral-subtle)' }}
              size='small'
            >
              Subtitle bottom
            </Paragraph>
          </div>
        </Card.Header>
        <Card.Content>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Card.Content>
      </Card>
      <Card
        color='first'
        MediaImage={CatImage}
      >
        <Card.Header>
          <div>
            <Heading
              level={3}
              size='small'
            >
              Card First
            </Heading>
            <Paragraph size='small'>Subtitle bottom</Paragraph>
          </div>
        </Card.Header>
        <Card.Content>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Card.Content>
      </Card>
      <Card
        color='second'
        MediaImage={CatImage}
      >
        <Card.Header>
          <div>
            <Heading
              level={3}
              size='small'
            >
              Card Second
            </Heading>
            <Paragraph size='small'>Subtitle bottom</Paragraph>
          </div>
        </Card.Header>
        <Card.Content>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Card.Content>
      </Card>
      <Card
        color='third'
        MediaImage={CatImage}
      >
        <Card.Header>
          <div>
            <Heading
              level={3}
              size='small'
            >
              Card Third
            </Heading>
            <Paragraph size='small'>Subtitle bottom</Paragraph>
          </div>
        </Card.Header>
        <Card.Content>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Card.Content>
      </Card>
    </>
  );
};

Variants.decorators = [
  (Story) => (
    <Stack
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, auto)',
        gridGap: 'var(--fds-spacing-layout-2-xs)',
      }}
    >
      <Story />
    </Stack>
  ),
];
