import React from 'react';
import type { Meta, StoryObj, StoryFn, ReactRenderer } from '@storybook/react';
import type { PartialStoryFn } from '@storybook/types';
import * as icons from '@navikt/aksel-icons';

import { Stack } from '../../../../../docs-components';
import { Spinner } from '../Spinner';

import { Button } from './';

type Story = StoryObj<typeof Button>;

const meta: Meta<typeof Button> = {
  title: 'Altinn/Button',
  component: Button,
};

export default meta;

const stack = (Story: PartialStoryFn<ReactRenderer>) => (
  <Stack>
    <Story />
  </Stack>
);

const icon = (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0Zm0 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm5.047 5.671 1.399 1.43-8.728 8.398L6 14.02l1.395-1.434 2.319 2.118 7.333-7.032Z'
      fill='currentColor'
    />
  </svg>
);

const VariantsTemplate = () => {
  return (
    <>
      <Button {...Filled.args}>Fylt</Button>
      <Button {...Outline.args}>Omriss</Button>
      <Button {...Quiet.args}>Gjennomsiktig</Button>
    </>
  );
};

type AkselIcon = typeof icons['AirplaneFillIcon'];
type AkselIcons = Record<string, AkselIcon>;

export const Preview: Story = {
  render: ({ icon = '', ...args }) => {
    // Hack to get dynamic preview of Aksel icons in Storybook
    const Icon: AkselIcon | undefined = (icons as AkselIcons)[icon as string];

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
      options: Object.keys(icons),
    },
  },
};

// This is an example of composed story
export const Variants: Story = {
  render: VariantsTemplate,
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
};

const Filled: Story = {
  name: 'Fylt med tekst',
  args: {
    children: 'Fylt',
    variant: 'filled',
  },
};

const Outline: Story = {
  name: 'Omriss med tekst',
  args: {
    children: 'Omriss',
    variant: 'outline',
  },
};

const Quiet: Story = {
  name: 'Gjennomsiktig med tekst',
  args: {
    children: 'Gjennomsiktig',
    variant: 'quiet',
  },
};

export const withIcon: StoryFn<typeof Button> = () => (
  <>
    <Button
      icon={icon}
      variant='filled'
      aria-label='Fylt med ikon'
    ></Button>
    <Button
      icon={icon}
      variant='outline'
      aria-label=' Omriss med ikon'
    ></Button>
    <Button
      icon={icon}
      variant='quiet'
      aria-label='Gjennomsiktig med ikon'
    ></Button>
  </>
);

withIcon.decorators = [stack];

export const withIconAndText: StoryFn<typeof Button> = () => (
  <>
    <Button
      icon={icon}
      variant='filled'
    >
      Fylt med ikon
    </Button>
    <Button
      icon={icon}
      variant='outline'
    >
      Omriss med ikon
    </Button>
    <Button
      icon={icon}
      variant='quiet'
    >
      Gjennomsiktig med ikon
    </Button>
  </>
);

withIconAndText.decorators = [stack];

export const withSpinner: StoryFn<typeof Button> = () => (
  <>
    <Button
      icon={icon}
      variant='filled'
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
      variant='outline'
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
      variant='quiet'
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
