import React from 'react';
import type { Meta, StoryObj, StoryFn, ReactRenderer } from '@storybook/react';
import type { PartialStoryFn } from '@storybook/types';
import * as akselIcons from '@navikt/aksel-icons';

import { Stack } from '../../../../../docs-components';
import { Spinner } from '../Spinner';

import classes from './test.module.css';

import { Button } from './';

type Story = StoryObj<typeof Button>;

const meta: Meta<typeof Button> = {
  title: 'Felles/Button',
  component: Button,
};

export default meta;

const stack = (Story: PartialStoryFn<ReactRenderer>) => (
  <Stack>
    <Story />
  </Stack>
);

const icon = <akselIcons.FloppydiskIcon />;

export const Preview: Story = {
  render: ({ ...args }) => {
    return <Button {...args} />;
  },
  args: {
    children: 'Knapp',
    disabled: false,
    variant: 'primary',
    color: 'first',
    size: 'medium',
    icon: false,
    fullWidth: false,
    className: classes.test,
  },
};

export const UsedAsLink: StoryFn<typeof Button> = () => (
  <Button
    as='a'
    target='_blank'
    href='https://www.designsystemet.no'
  >
    <akselIcons.PersonChatIcon />
    Gå til Designsystemet
  </Button>
);

export const Variants: StoryFn<typeof Button> = () => {
  return (
    <>
      <Button>Primary</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='tertiary'>Tertiary</Button>

      <Button color='second'>Primary</Button>
      <Button
        color='second'
        variant='secondary'
      >
        Secondary
      </Button>
      <Button
        color='second'
        variant='tertiary'
      >
        Tertiary
      </Button>

      <Button color='success'>Primary</Button>
      <Button
        color='success'
        variant='secondary'
      >
        Secondary
      </Button>
      <Button
        color='success'
        variant='tertiary'
      >
        Tertiary
      </Button>

      <Button color='danger'>Primary</Button>
      <Button
        color='danger'
        variant='secondary'
      >
        Secondary
      </Button>
      <Button
        color='danger'
        variant='tertiary'
      >
        Tertiary
      </Button>
    </>
  );
};

Variants.decorators = [
  (Story) => (
    <Stack
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, auto)',
      }}
    >
      <Story />
    </Stack>
  ),
];

export const WithIcon: StoryFn<typeof Button> = () => (
  <>
    <Button
      icon={true}
      variant='primary'
      aria-label='Primary med ikon'
    >
      {icon}
    </Button>
    <Button
      icon={true}
      variant='secondary'
      aria-label=' Secondary med ikon'
    >
      {icon}
    </Button>
    <Button
      icon={true}
      variant='tertiary'
      aria-label='Tertiary med ikon'
    >
      {icon}
    </Button>
    <Button
      icon={true}
      color='second'
      variant='primary'
      aria-label='Primary med ikon'
    >
      {icon}
    </Button>
    <Button
      icon={true}
      color='second'
      variant='secondary'
      aria-label=' Secondary med ikon'
    >
      {icon}
    </Button>
    <Button
      icon={true}
      color='second'
      variant='tertiary'
      aria-label='Tertiary med ikon'
    >
      {icon}
    </Button>
    <Button
      icon={true}
      color='success'
      variant='primary'
      aria-label='Primary med ikon'
    >
      <akselIcons.CheckmarkIcon />
    </Button>
    <Button
      icon={true}
      color='success'
      variant='secondary'
      aria-label=' Secondary med ikon'
    >
      <akselIcons.CheckmarkIcon />
    </Button>
    <Button
      icon={true}
      color='success'
      variant='tertiary'
      aria-label='Tertiary med ikon'
    >
      <akselIcons.CheckmarkIcon />
    </Button>
    <Button
      icon={true}
      color='danger'
      variant='primary'
      aria-label='Primary med ikon'
    >
      <akselIcons.TrashIcon />
    </Button>
    <Button
      icon={true}
      color='danger'
      variant='secondary'
      aria-label=' Secondary med ikon'
    >
      <akselIcons.TrashIcon />
    </Button>
    <Button
      icon={true}
      color='danger'
      variant='tertiary'
      aria-label='Tertiary med ikon'
    >
      <akselIcons.TrashIcon />
    </Button>
  </>
);

WithIcon.decorators = [
  (Story) => (
    <Stack
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, auto)',
      }}
    >
      <Story />
    </Stack>
  ),
];

export const WithIconAndText: StoryFn<typeof Button> = () => (
  <>
    <Button variant='primary'>
      {icon}
      Primary
    </Button>
    <Button variant='secondary'>
      {icon}
      Secondary
    </Button>
    <Button variant='tertiary'>
      {icon}
      Tertiary
    </Button>
  </>
);

WithIconAndText.decorators = [stack];

export const WithSpinner: StoryFn<typeof Button> = () => (
  <>
    <Button
      variant='primary'
      aria-disabled
    >
      {icon}
      <Spinner
        variant='interaction'
        title='loading'
        size='small'
      />
      Laster...
    </Button>
    <Button
      variant='secondary'
      aria-disabled
    >
      {icon}
      <Spinner
        variant='interaction'
        title='loading'
        size='small'
      />
      Laster...
    </Button>
    <Button
      variant='tertiary'
      aria-disabled
    >
      {icon}
      <Spinner
        variant='interaction'
        title='loading'
        size='small'
      />
      Laster...
    </Button>
  </>
);

WithSpinner.decorators = [stack];

export const FullWidth: Story = {
  name: 'Full bredde',
  args: {
    children: 'Full bredde',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};
