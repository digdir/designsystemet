import { Stack } from '@doc-components';
import {
  ArrowForwardIcon,
  ArrowRightIcon,
  ArrowUndoIcon,
  BellIcon,
  CogIcon,
  ExternalLinkIcon,
  PencilWritingIcon,
  PlusCircleIcon,
  PlusIcon,
  PrinterSmallIcon,
  TrashIcon,
} from '@navikt/aksel-icons';
import type { Meta, ReactRenderer, StoryFn, StoryObj } from '@storybook/react';
import type { PartialStoryFn } from '@storybook/types';

import { Spinner } from '../Spinner';
import { Tooltip } from '../Tooltip';

import { Button } from './';

type Story = StoryObj<typeof Button>;

const meta: Meta<typeof Button> = {
  title: 'Komponenter/Button',
  component: Button,
};

export default meta;

const stack = (Story: PartialStoryFn<ReactRenderer>) => (
  <Stack>
    <Story />
  </Stack>
);
export const Preview: Story = {
  render: ({ ...args }) => {
    return <Button {...args} />;
  },
  args: {
    children: 'Knapp',
    disabled: false,
    variant: 'primary',
    color: 'accent',
    size: 'md',
    icon: false,
    fullWidth: false,
  },
};

export const Primary: StoryFn<typeof Button> = () => (
  <>
    <Button variant='primary' color='accent'>
      Lagre
    </Button>
  </>
);

Primary.decorators = [stack];

export const Secondary: StoryFn<typeof Button> = () => (
  <>
    <Button variant='secondary' color='accent'>
      Avbryt
    </Button>
  </>
);

Secondary.decorators = [stack];

export const Tertiary: StoryFn<typeof Button> = () => (
  <>
    <Button variant='tertiary' color='accent'>
      <PencilWritingIcon aria-hidden fontSize='1.5rem' />
      Rediger
    </Button>
  </>
);

Tertiary.decorators = [stack];

export const First: StoryFn<typeof Button> = () => (
  <>
    <Button variant='primary' color='accent'>
      Gå videre
    </Button>
    <Button variant='secondary' color='accent'>
      Fortsett senere
    </Button>
    <Button variant='tertiary' color='accent'>
      Avbryt
    </Button>
  </>
);

First.decorators = [stack];

export const Second: StoryFn<typeof Button> = () => (
  <>
    <Button variant='secondary' color='neutral'>
      <PrinterSmallIcon aria-hidden fontSize='1.5rem' />
      Skriv ut
    </Button>
    <Button variant='secondary' color='neutral'>
      <PencilWritingIcon aria-hidden fontSize='1.5rem' />
      Rediger
    </Button>
    <Button variant='secondary' color='neutral'>
      <ArrowForwardIcon aria-hidden fontSize='1.5rem' />
      Videresend
    </Button>
  </>
);

Second.decorators = [stack];

export const Danger: StoryFn<typeof Button> = () => (
  <>
    <Button variant='primary' color='danger'>
      <TrashIcon aria-hidden fontSize='1.5rem' />
      Slett
    </Button>
  </>
);

Danger.decorators = [
  (Story) => (
    <Stack
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Story />
    </Stack>
  ),
];

export const CombinedColors: StoryFn<typeof Button> = () => (
  <>
    <Button variant='primary' color='neutral'>
      Publiser
    </Button>
    <Button variant='secondary' color='neutral'>
      Lagre kladd
    </Button>
    <Button variant='tertiary' color='danger'>
      Forkast
    </Button>
  </>
);

CombinedColors.decorators = [stack];

export const AsLink: StoryFn<typeof Button> = () => (
  <Button asChild>
    <a target='_blank' rel='noreferrer' href='https://www.designsystemet.no'>
      Gå til Designsystemet
      <ExternalLinkIcon fontSize='1.5rem' />
    </a>
  </Button>
);

export const TextAndIcon: StoryFn<typeof Button> = () => (
  <>
    <Button variant='primary' color='neutral'>
      Start utfylling
      <ArrowRightIcon aria-hidden fontSize='1.5rem' />
    </Button>
    <Button variant='secondary' color='neutral'>
      <ArrowUndoIcon aria-hidden fontSize='1.5rem' />
      Angre
    </Button>
  </>
);

TextAndIcon.decorators = [stack];

export const Loading: StoryFn<typeof Button> = () => (
  <>
    <Button variant='primary' loading>
      Laster...
    </Button>
    <Button variant='secondary' loading>
      Laster...
    </Button>
    <Button variant='tertiary' loading>
      Laster...
    </Button>
  </>
);

Loading.decorators = [stack];

export const FullWidth: Story = {
  args: {
    children: (
      <>
        <PlusIcon fontSize='1.5rem' />
        Last inn flere
      </>
    ),
    fullWidth: true,
    color: 'neutral',
    variant: 'secondary',
  },
  parameters: {
    layout: 'padded',
  },
};

export const Icons: StoryFn<typeof Button> = () => (
  <>
    <Button variant='primary' size='sm'>
      <CogIcon fontSize='1rem' />
    </Button>
    <Button variant='primary' size='sm'>
      <CogIcon fontSize='1rem' />
      Small
    </Button>
    <Button variant='primary' size='md'>
      <CogIcon fontSize='1.5rem' />
    </Button>
    <Button variant='primary' size='md'>
      <CogIcon fontSize='1.5rem' />
      Medium
    </Button>
    <Button variant='primary' size='lg'>
      <CogIcon fontSize='2rem' />
    </Button>
    <Button variant='primary' size='lg'>
      <CogIcon fontSize='2rem' />
      Large
    </Button>
  </>
);

Icons.decorators = [stack];

export const IconOnly: StoryFn<typeof Button> = () => (
  <>
    <Tooltip content='Legg til ny'>
      <Button
        icon
        color='neutral'
        variant='tertiary'
        aria-label='Tertiary med ikon'
      >
        <PlusCircleIcon fontSize='1.5rem' />
      </Button>
    </Tooltip>
    <Tooltip content='Varslinger'>
      <Button
        icon
        color='neutral'
        variant='tertiary'
        aria-label='Tertiary med ikon'
      >
        <BellIcon fontSize='1.5rem' />
      </Button>
    </Tooltip>
    <Tooltip content='Instillinger'>
      <Button
        icon
        color='neutral'
        variant='tertiary'
        aria-label='Tertiary med ikon'
      >
        <CogIcon fontSize='1.5rem' />
      </Button>
    </Tooltip>
  </>
);

IconOnly.decorators = [
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

export const IconsOnlyPrimary: StoryFn<typeof Button> = () => (
  <>
    <Button icon variant='primary' size='sm'>
      <CogIcon fontSize='1.5rem' />
    </Button>
    <Button icon variant='primary' size='md'>
      <CogIcon fontSize='2rem' />
    </Button>
    <Button icon variant='primary' size='lg'>
      <CogIcon fontSize='2.5rem' />
    </Button>
  </>
);

IconsOnlyPrimary.decorators = [stack];
