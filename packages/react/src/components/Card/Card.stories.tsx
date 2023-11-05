import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { TrashFillIcon } from '@navikt/aksel-icons';

import media from '../../../../../assets/img/card-media.png';
import { Textfield } from '../form/Textfield';
import { Select } from '../Select';
import { Heading, Paragraph } from '../Typography';
import { Button } from '../Button';
import { Stack } from '../../../../../docs-components';

import { Card } from '.';

type Story = StoryFn<typeof Card>;

export default {
  title: 'Felles/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const Preview: Story = (args) => (
  <Card
    borderRadius='large'
    border='subtle'
    {...args}
  >
    <Card.Header>
      <Paragraph size='medium'>Rolle 1</Paragraph>
      <Button
        variant='secondary'
        color='danger'
        size='small'
        icon={<TrashFillIcon aria-hidden />}
      >
        Fjern
      </Button>
    </Card.Header>
    <Card.Content>
      <Select
        label='Velg rolle'
        options={[
          { value: 'daglig leder', label: 'Dalig leder' },
          { value: 'forretningsfører', label: 'Forretningsfører' },
        ]}
      />
      <Textfield
        size='small'
        label='Fødsels- eller d-nummer'
      />
      <Textfield
        size='small'
        label='Etternavn'
      />
    </Card.Content>
  </Card>
);

export const Variants: StoryFn<typeof Card> = () => {
  return (
    <>
      <Card
        variant='neutral'
        borderRadius='large'
        border='subtle'
        mediaImage={media as string}
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
        <Card.Footer divided>
          <Paragraph size='small'>Footer text</Paragraph>
        </Card.Footer>
      </Card>
      <Card
        variant='subtle'
        borderRadius='large'
        border='subtle'
        mediaImage={media as string}
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
        <Card.Footer divided>
          <Paragraph size='small'>Footer text</Paragraph>
        </Card.Footer>
      </Card>
      <Card
        variant='first'
        borderRadius='large'
        border='subtle'
        mediaImage={media as string}
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
        <Card.Footer divided>
          <Paragraph size='small'>Footer text</Paragraph>
        </Card.Footer>
      </Card>
      <Card
        variant='second'
        borderRadius='large'
        border='subtle'
        mediaImage={media as string}
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
        <Card.Footer divided>
          <Paragraph size='small'>Footer text</Paragraph>
        </Card.Footer>
      </Card>
      <Card
        variant='third'
        borderRadius='large'
        border='subtle'
        mediaImage={media as string}
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
        <Card.Footer divided>
          <Paragraph size='small'>Footer text</Paragraph>
        </Card.Footer>
      </Card>
    </>
  );
};

Variants.decorators = [
  (Story) => (
    <Stack
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, auto)',
      }}
    >
      <Story />
    </Stack>
  ),
];
