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

type AkselIcon = typeof akselIcons['AirplaneFillIcon'];
type AkselIcons = Record<string, AkselIcon>;

export const Preview: Story = {
  render: ({ icon = '', ...args }) => {
    // Hack to get dynamic preview of Aksel icons in Storybook
    const Icon: AkselIcon | undefined = (akselIcons as AkselIcons)[
      icon as string
    ];

    return (
      <Button
        {...args}
        icon={Icon ? <Icon /> : undefined}
      ></Button>
    );
  },
  args: {
    children: 'Knapp',
    disabled: false,
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
    as='a'
    icon={<akselIcons.PersonChatIcon />}
    iconPlacement='right'
    target='_blank'
    href='https://www.designsystemet.no'
  >
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

export const withIcon: StoryFn<typeof Button> = () => (
  <>
    <Button
      icon={icon}
      variant='primary'
      aria-label='Primary med ikon'
    ></Button>
    <Button
      icon={icon}
      variant='secondary'
      aria-label=' Sekundær med ikon'
    ></Button>
    <Button
      icon={icon}
      variant='tertiary'
      aria-label='Tertiary med ikon'
    ></Button>
    <Button
      icon={icon}
      color='second'
      variant='primary'
      aria-label='Primary med ikon'
    ></Button>
    <Button
      icon={icon}
      color='second'
      variant='secondary'
      aria-label=' Sekundær med ikon'
    ></Button>
    <Button
      icon={icon}
      color='second'
      variant='tertiary'
      aria-label='Tertiary med ikon'
    ></Button>
    <Button
      icon={<akselIcons.CheckmarkIcon />}
      color='success'
      variant='primary'
      aria-label='Primary med ikon'
    ></Button>
    <Button
      icon={<akselIcons.CheckmarkIcon />}
      color='success'
      variant='secondary'
      aria-label=' Sekundær med ikon'
    ></Button>
    <Button
      icon={<akselIcons.CheckmarkIcon />}
      color='success'
      variant='tertiary'
      aria-label='Tertiary med ikon'
    ></Button>
    <Button
      icon={<akselIcons.TrashIcon />}
      color='danger'
      variant='primary'
      aria-label='Primary med ikon'
    ></Button>
    <Button
      icon={<akselIcons.TrashIcon />}
      color='danger'
      variant='secondary'
      aria-label=' Sekundær med ikon'
    ></Button>
    <Button
      icon={<akselIcons.TrashIcon />}
      color='danger'
      variant='tertiary'
      aria-label='Tertiary med ikon'
    ></Button>
  </>
);

withIcon.decorators = [
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

export const withIconAndText: StoryFn<typeof Button> = () => (
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

withIconAndText.decorators = [stack];

export const withSpinner: StoryFn<typeof Button> = () => (
  <>
    <Button
      icon={icon}
      variant='primary'
      aria-disabled
    >
      <Spinner
        variant='interaction'
        title='loading'
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
      />
      Laster...
    </Button>
  </>
);

withSpinner.decorators = [stack];

export const fullWidth: Story = {
  name: 'Full bredde',
  args: {
    children: 'Full bredde',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};
