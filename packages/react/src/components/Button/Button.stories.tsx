import type { Meta, StoryObj, StoryFn, ReactRenderer } from '@storybook/react';
import type { PartialStoryFn } from '@storybook/types';
import {
  PencilWritingIcon,
  PrinterSmallIcon,
  ArrowForwardIcon,
  TrashIcon,
  ExternalLinkIcon,
  PlusCircleIcon,
  BellIcon,
  CogIcon,
  ArrowRightIcon,
  ArrowUndoIcon,
  PlusIcon,
} from '@navikt/aksel-icons';
import { Stack } from '@doc-components';

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
    <Button
      variant='primary'
      color='accent'
    >
      Lagre
    </Button>
  </>
);

Primary.decorators = [stack];

export const Secondary: StoryFn<typeof Button> = () => (
  <>
    <Button
      variant='secondary'
      color='accent'
    >
      Avbryt
    </Button>
  </>
);

Secondary.decorators = [stack];

export const Tertiary: StoryFn<typeof Button> = () => (
  <>
    <Button
      variant='tertiary'
      color='accent'
    >
      <PencilWritingIcon
        aria-hidden
        fontSize='1.5rem'
      />
      Rediger
    </Button>
  </>
);

Tertiary.decorators = [stack];

export const First: StoryFn<typeof Button> = () => (
  <>
    <Button
      variant='primary'
      color='accent'
    >
      Gå videre
    </Button>
    <Button
      variant='secondary'
      color='accent'
    >
      Fortsett senere
    </Button>
    <Button
      variant='tertiary'
      color='accent'
    >
      Avbryt
    </Button>
  </>
);

First.decorators = [stack];

export const Second: StoryFn<typeof Button> = () => (
  <>
    <Button
      variant='secondary'
      color='neutral'
    >
      <PrinterSmallIcon
        aria-hidden
        fontSize='1.5rem'
      />
      Skriv ut
    </Button>
    <Button
      variant='secondary'
      color='neutral'
    >
      <PencilWritingIcon
        aria-hidden
        fontSize='1.5rem'
      />
      Rediger
    </Button>
    <Button
      variant='secondary'
      color='neutral'
    >
      <ArrowForwardIcon
        aria-hidden
        fontSize='1.5rem'
      />
      Videresend
    </Button>
  </>
);

Second.decorators = [stack];

export const Danger: StoryFn<typeof Button> = () => (
  <>
    <Button
      variant='primary'
      color='danger'
    >
      <TrashIcon
        aria-hidden
        fontSize='1.5rem'
      />
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

export const Success: StoryFn<typeof Button> = () => (
  <>
    <Button
      variant='primary'
      color='success'
    >
      Send inn
    </Button>
  </>
);

Success.decorators = [stack];

export const KombinereFarger: StoryFn<typeof Button> = () => (
  <>
    <Button
      variant='primary'
      color='neutral'
    >
      Publiser
    </Button>
    <Button
      variant='secondary'
      color='neutral'
    >
      Lagre kladd
    </Button>
    <Button
      variant='tertiary'
      color='danger'
    >
      Forkast
    </Button>
  </>
);

KombinereFarger.decorators = [stack];

export const KnappSomLenke: StoryFn<typeof Button> = () => (
  <Button asChild>
    <a
      target='_blank'
      rel='noreferrer'
      href='https://www.designsystemet.no'
    >
      Gå til Designsystemet
      <ExternalLinkIcon fontSize='1.5rem' />
    </a>
  </Button>
);

export const BareIkon: StoryFn<typeof Button> = () => (
  <>
    <Tooltip content='Legg til ny'>
      <Button
        icon={true}
        color='neutral'
        variant='tertiary'
        aria-label='Tertiary med ikon'
      >
        <PlusCircleIcon fontSize='1.5rem' />
      </Button>
    </Tooltip>
    <Tooltip content='Varslinger'>
      <Button
        icon={true}
        color='neutral'
        variant='tertiary'
        aria-label='Tertiary med ikon'
      >
        <BellIcon fontSize='1.5rem' />
      </Button>
    </Tooltip>
    <Tooltip content='Instillinger'>
      <Button
        icon={true}
        color='neutral'
        variant='tertiary'
        aria-label='Tertiary med ikon'
      >
        <CogIcon fontSize='1.5rem' />
      </Button>
    </Tooltip>
  </>
);

BareIkon.decorators = [
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

export const TekstOgIkon: StoryFn<typeof Button> = () => (
  <>
    <Button
      variant='primary'
      color='neutral'
    >
      Start utfylling
      <ArrowRightIcon
        aria-hidden
        fontSize='1.5rem'
      />
    </Button>
    <Button
      variant='secondary'
      color='neutral'
    >
      <ArrowUndoIcon
        aria-hidden
        fontSize='1.5rem'
      />
      Angre
    </Button>
  </>
);

TekstOgIkon.decorators = [stack];

export const Lasting: StoryFn<typeof Button> = () => (
  <>
    <Button
      variant='primary'
      aria-disabled
    >
      <Spinner
        variant='interaction'
        title='loading'
        size='sm'
      />
      Laster...
    </Button>
    <Button
      variant='secondary'
      aria-disabled
    >
      <Spinner
        variant='interaction'
        title='loading'
        size='sm'
      />
      Laster...
    </Button>
    <Button
      variant='tertiary'
      aria-disabled
    >
      <Spinner
        variant='interaction'
        title='loading'
        size='sm'
      />
      Laster...
    </Button>
  </>
);

Lasting.decorators = [stack];

export const FullBredde: Story = {
  name: 'Full bredde',
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

export const Ikoner: StoryFn<typeof Button> = () => (
  <>
    <Button
      variant='primary'
      size='sm'
    >
      <CogIcon fontSize='1rem' />
      Small
    </Button>
    <Button
      variant='primary'
      size='md'
    >
      <CogIcon fontSize='1.5rem' />
      Medium
    </Button>
    <Button
      variant='primary'
      size='lg'
    >
      <CogIcon fontSize='2rem' />
      Large
    </Button>
  </>
);

Ikoner.decorators = [stack];

export const Kunikoner: StoryFn<typeof Button> = () => (
  <>
    <Button
      icon={true}
      variant='primary'
      size='sm'
    >
      <CogIcon fontSize='1.5rem' />
    </Button>
    <Button
      icon={true}
      variant='primary'
      size='md'
    >
      <CogIcon fontSize='2rem' />
    </Button>
    <Button
      icon={true}
      variant='primary'
      size='lg'
    >
      <CogIcon fontSize='2.5rem' />
    </Button>
  </>
);

Kunikoner.decorators = [stack];
