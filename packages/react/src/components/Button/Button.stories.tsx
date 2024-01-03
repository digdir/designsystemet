import React from 'react';
import type { Meta, StoryObj, StoryFn, ReactRenderer } from '@storybook/react';
import type { PartialStoryFn } from '@storybook/types';
import * as akselIcons from '@navikt/aksel-icons';

import { Stack } from '../../../../../docs-components';
import { Spinner } from '../Spinner';

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
    return <Button {...args}></Button>;
  },
  args: {
    children: 'Knapp',
    disabled: false,
    variant: 'primary',
    color: 'first',
    size: 'medium',
  },
  argTypes: {
    icon: {
      control: 'select',
      options: Object.keys(akselIcons),
    },
  },
};

export const UsedAsLink: StoryFn<typeof Button> = () => (
  <Button
    iconPlacement='right'
    asChild
  >
    <a
      target='_blank'
      href='https://www.designsystemet.no'
      rel='noreferrer'
    >
      <Button.Icon>
        <akselIcons.PersonChatIcon />
      </Button.Icon>
      Gå til Designsystemet
    </a>
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
      onlyIcon
      variant='primary'
      aria-label='Primary med ikon'
    >
      <Button.Icon>{icon}</Button.Icon>
    </Button>
    <Button
      onlyIcon
      variant='secondary'
      aria-label=' Secondary med ikon'
    >
      <Button.Icon>{icon}</Button.Icon>
    </Button>
    <Button
      onlyIcon
      variant='tertiary'
      aria-label='Tertiary med ikon'
    >
      <Button.Icon>{icon}</Button.Icon>
    </Button>
    <Button
      onlyIcon
      color='second'
      variant='primary'
      aria-label='Primary med ikon'
    >
      <Button.Icon>{icon}</Button.Icon>
    </Button>
    <Button
      onlyIcon
      color='second'
      variant='secondary'
      aria-label=' Secondary med ikon'
    >
      <Button.Icon>{icon}</Button.Icon>
    </Button>
    <Button
      onlyIcon
      color='second'
      variant='tertiary'
      aria-label='Tertiary med ikon'
    >
      <Button.Icon>{icon}</Button.Icon>
    </Button>
    <Button
      onlyIcon
      color='success'
      variant='primary'
      aria-label='Primary med ikon'
    >
      <Button.Icon>
        <akselIcons.CheckmarkIcon />
      </Button.Icon>
    </Button>
    <Button
      onlyIcon
      color='success'
      variant='secondary'
      aria-label=' Secondary med ikon'
    >
      <Button.Icon>
        <akselIcons.CheckmarkIcon />
      </Button.Icon>
    </Button>
    <Button
      onlyIcon
      color='success'
      variant='tertiary'
      aria-label='Tertiary med ikon'
    >
      <Button.Icon>
        <akselIcons.CheckmarkIcon />
      </Button.Icon>
    </Button>
    <Button
      onlyIcon
      color='danger'
      variant='primary'
      aria-label='Primary med ikon'
    >
      <Button.Icon>
        <akselIcons.TrashIcon />
      </Button.Icon>
    </Button>
    <Button
      onlyIcon
      color='danger'
      variant='secondary'
      aria-label=' Secondary med ikon'
    >
      <Button.Icon>
        <akselIcons.TrashIcon />
      </Button.Icon>
    </Button>
    <Button
      onlyIcon
      color='danger'
      variant='tertiary'
      aria-label='Tertiary med ikon'
    >
      <Button.Icon>
        <akselIcons.TrashIcon />
      </Button.Icon>
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
    <Button
      icon={icon}
      variant='primary'
    >
      Primary
    </Button>
    <Button
      icon={icon}
      variant='secondary'
    >
      Secondary
    </Button>
    <Button
      icon={icon}
      variant='tertiary'
    >
      Tertiary
    </Button>
  </>
);

WithIconAndText.decorators = [stack];

export const WithSpinner: StoryFn<typeof Button> = () => (
  <>
    <Button
      icon={icon}
      variant='primary'
      aria-disabled
    >
      <Spinner
        variant='interaction'
        title='loading'
        size='small'
      />
      Laster...
    </Button>
    <Button
      icon={icon}
      variant='secondary'
      aria-disabled
    >
      <Spinner
        variant='interaction'
        title='loading'
        size='small'
      />
      Laster...
    </Button>
    <Button
      icon={icon}
      variant='tertiary'
      aria-disabled
    >
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
