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
  PrinterSmallIcon,
  TrashIcon,
} from '@navikt/aksel-icons';
import type { Meta, ReactRenderer, StoryFn, StoryObj } from '@storybook/react';
import type { PartialStoryFn } from '@storybook/types';

import { Tooltip } from '../';

import { Button } from './';

type Story = StoryObj<typeof Button>;

const meta: Meta<typeof Button> = {
  title: 'Komponenter/Button',
  component: Button,
  decorators: [
    (Story: PartialStoryFn<ReactRenderer>) => (
      <Stack>
        <style>
          {`:root {
          --ds-sizing-scale-base: var(--ds-font-size-5);
          --ds-sizing-scale-min: 0.125rem; /* Minimum 2px steps */
          --ds-sizing-scale: .25rem; /* Default 4px steps */

          --ds-sizing-adjust: calc((var(--ds-sizing-scale-base) - 1em) * .5); /* Fallback if not supporting round() */
          --ds-sizing-adjust: round(up, calc((var(--ds-sizing-scale-base) - 1em) * .5), 0.0625rem); /* Round to nearest 1px */

          ${Array.from(
            { length: 31 },
            (_, i) =>
              `--ds-sizing-${i}: max(calc((var(--ds-sizing-scale) - var(--ds-sizing-adjust)) * ${i} + var(--ds-sizing-adjust)), calc(var(--ds-sizing-scale-min) * ${i}));
            --ds-spacing-${i}:var(--ds-sizing-${i});`,
          )
            .slice(1)
            .join('\n')}
        }`}
        </style>
        <Story />
      </Stack>
    ),
  ],
};

export default meta;

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
  },
};

export const Primary: StoryFn<typeof Button> = () => (
  <>
    <Button variant='primary' color='accent'>
      Lagre
    </Button>
  </>
);

export const Secondary: StoryFn<typeof Button> = () => (
  <>
    <Button variant='secondary' color='accent'>
      Avbryt
    </Button>
  </>
);

export const Tertiary: StoryFn<typeof Button> = () => (
  <>
    <Button variant='tertiary' color='accent'>
      <PencilWritingIcon aria-hidden fontSize='1.5rem' />
      Rediger
    </Button>
  </>
);

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

export const AsLink: StoryFn<typeof Button> = () => (
  <Button asChild>
    <a target='_blank' rel='noreferrer' href='https://www.designsystemet.no'>
      Gå til Designsystemet
      <ExternalLinkIcon fontSize='1.5rem' title='Ekstern lenke' />
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

export const Icons: StoryFn<typeof Button> = () => (
  <>
    <Button variant='primary' size='sm' icon>
      <CogIcon fontSize='1rem' title='Innstillinger' />
    </Button>
    <Button variant='primary' size='sm'>
      <CogIcon fontSize='1rem' aria-hidden />
      Small
    </Button>
    <Button variant='primary' size='md' icon>
      <CogIcon fontSize='1.5rem' title='Innstillinger' />
    </Button>
    <Button variant='primary' size='md'>
      <CogIcon fontSize='1.5rem' aria-hidden />
      Medium
    </Button>
    <Button variant='primary' size='lg' icon>
      <CogIcon fontSize='2rem' title='Innstillinger' />
    </Button>
    <Button variant='primary' size='lg'>
      <CogIcon fontSize='2rem' aria-hidden />
      Large
    </Button>
  </>
);

export const IconOnly: StoryFn<typeof Button> = () => (
  <>
    <Tooltip content='Legg til ny'>
      <Button icon color='neutral' variant='tertiary' aria-label='Legg til ny'>
        <PlusCircleIcon fontSize='1.5rem' aria-hidden />
      </Button>
    </Tooltip>
    <Tooltip content='Varslinger'>
      <Button icon color='neutral' variant='tertiary' aria-label='Varslinger'>
        <BellIcon fontSize='1.5rem' aria-hidden />
      </Button>
    </Tooltip>
    <Tooltip content='Instillinger'>
      <Button
        icon
        color='neutral'
        variant='tertiary'
        aria-label='Innstillinger'
      >
        <CogIcon fontSize='1.5rem' aria-hidden />
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
      <CogIcon fontSize='1.5rem' title='Innstillinger' />
    </Button>
    <Button icon variant='primary' size='md'>
      <CogIcon fontSize='2rem' title='Innstillinger' />
    </Button>
    <Button icon variant='primary' size='lg'>
      <CogIcon fontSize='2.5rem' title='Innstillinger' />
    </Button>
  </>
);
