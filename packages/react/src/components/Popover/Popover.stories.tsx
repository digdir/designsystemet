import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { Button, Paragraph } from '../..';

import { Popover } from '.';

const marginDecorator = (Story: StoryFn) => (
  <div style={{ margin: '10rem' }}>
    <Story />
  </div>
);

export default {
  title: 'Felles/Popover',
  component: Popover,
} as Meta;

export const Preview: StoryFn<typeof Popover> = (args) => {
  return (
    <Popover {...args}>
      <Popover.Trigger>My trigger!</Popover.Trigger>
      <Popover.Content>popover content</Popover.Content>
    </Popover>
  );
};

Preview.args = {
  placement: 'top',
  variant: 'default',
  open: false,
  size: 'medium',
};

Preview.decorators = [marginDecorator];

export const Variants: StoryFn<typeof Popover> = () => {
  return (
    <>
      <Popover
        open={true}
        placement='top'
      >
        <Popover.Trigger asChild>
          <span>popover</span>
        </Popover.Trigger>
        <Popover.Content>default</Popover.Content>
      </Popover>
      <Popover
        open={true}
        placement='bottom'
        variant='danger'
      >
        <Popover.Trigger asChild>
          <span>popover</span>
        </Popover.Trigger>
        <Popover.Content>danger</Popover.Content>
      </Popover>
      <Popover
        open={true}
        placement='top'
        variant='info'
      >
        <Popover.Trigger asChild>
          <span>popover</span>
        </Popover.Trigger>
        <Popover.Content>info</Popover.Content>
      </Popover>
      <Popover
        open={true}
        placement='bottom'
        variant='warning'
      >
        <Popover.Trigger asChild>
          <span>popover</span>
        </Popover.Trigger>
        <Popover.Content>warning</Popover.Content>
      </Popover>
    </>
  );
};

Variants.decorators = [marginDecorator];

export const InteractiveContent: StoryFn<typeof Popover> = () => {
  return (
    <>
      <Popover>
        <Popover.Trigger>My trigger</Popover.Trigger>
        <Popover.Content>
          <Paragraph>Er du sikker på at du vil slette?</Paragraph>
          <Button
            size='small'
            color='danger'
          >
            Slett
          </Button>
        </Popover.Content>
      </Popover>
    </>
  );
};

InteractiveContent.decorators = [marginDecorator];

export const InPortal = () => {
  return (
    <Popover portal>
      <Popover.Trigger>My trigger</Popover.Trigger>
      <Popover.Content>popover content</Popover.Content>
    </Popover>
  );
};
