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
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Tooltip } from '../';
import { Button } from './';

type Story = StoryObj<typeof Button>;

const meta: Meta<typeof Button> = {
  title: 'Komponenter/Button',
  component: Button,
  parameters: {
    customStyles: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 'var(--ds-spacing-4)',
    },
  },
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
    'data-size': 'md',
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
      <PencilWritingIcon aria-hidden />
      Rediger
    </Button>
  </>
);

export const Accent: StoryFn<typeof Button> = () => (
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

export const AccentHover = Accent.bind({});
AccentHover.parameters = {
  pseudo: { hover: true },
  chromatic: { modes: { mobile: { disable: true } } },
};

export const AccentPressed = Accent.bind({});
AccentPressed.parameters = {
  pseudo: { active: true },
  chromatic: { modes: { mobile: { disable: true } } },
};

export const Neutral: StoryFn<typeof Button> = () => (
  <>
    <Button variant='primary' color='neutral'>
      <PrinterSmallIcon aria-hidden />
      Skriv ut
    </Button>
    <Button variant='secondary' color='neutral'>
      <PencilWritingIcon aria-hidden />
      Rediger
    </Button>
    <Button variant='tertiary' color='neutral'>
      <ArrowForwardIcon aria-hidden />
      Videresend
    </Button>
  </>
);

export const NeutralHover = Neutral.bind({});
NeutralHover.parameters = {
  pseudo: { hover: true },
  chromatic: { modes: { mobile: { disable: true } } },
};

export const NeutralPressed = Neutral.bind({});
NeutralPressed.parameters = {
  pseudo: { active: true },
  chromatic: { modes: { mobile: { disable: true } } },
};

export const Danger: StoryFn<typeof Button> = () => (
  <>
    <Button variant='primary' color='danger'>
      <TrashIcon aria-hidden />
      Slett
    </Button>
    <Button variant='secondary' color='danger'>
      <TrashIcon aria-hidden />
      Slett
    </Button>
    <Button variant='tertiary' color='danger'>
      <TrashIcon aria-hidden />
      Slett
    </Button>
  </>
);

export const DangerHover = Danger.bind({});
DangerHover.parameters = {
  pseudo: { hover: true },
  chromatic: { modes: { mobile: { disable: true } } },
};

export const DangerPressed = Danger.bind({});
DangerPressed.parameters = {
  pseudo: { active: true },
  chromatic: { modes: { mobile: { disable: true } } },
};

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
      <ExternalLinkIcon title='Ekstern lenke' />
    </a>
  </Button>
);

export const TextAndIcon: StoryFn<typeof Button> = () => (
  <>
    <Button variant='primary' color='neutral'>
      Start utfylling
      <ArrowRightIcon aria-hidden />
    </Button>
    <Button variant='secondary' color='neutral'>
      <ArrowUndoIcon aria-hidden />
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
    <Button variant='primary' data-size='sm' icon>
      <CogIcon title='Innstillinger' />
    </Button>
    <Button variant='primary' data-size='sm'>
      <CogIcon aria-hidden />
      Small
    </Button>
    <Button variant='primary' data-size='md' icon>
      <CogIcon title='Innstillinger' />
    </Button>
    <Button variant='primary' data-size='md'>
      <CogIcon aria-hidden />
      Medium
    </Button>
    <Button variant='primary' data-size='lg' icon>
      <CogIcon title='Innstillinger' />
    </Button>
    <Button variant='primary' data-size='lg'>
      <CogIcon aria-hidden />
      Large
    </Button>
  </>
);

export const IconOnly: StoryFn<typeof Button> = () => (
  <>
    <Tooltip content='Legg til ny'>
      <Button icon color='neutral' variant='tertiary' aria-label='Legg til ny'>
        <PlusCircleIcon aria-hidden />
      </Button>
    </Tooltip>
    <Tooltip content='Varslinger'>
      <Button icon color='neutral' variant='tertiary' aria-label='Varslinger'>
        <BellIcon aria-hidden />
      </Button>
    </Tooltip>
    <Tooltip content='Instillinger'>
      <Button
        icon
        color='neutral'
        variant='tertiary'
        aria-label='Innstillinger'
      >
        <CogIcon aria-hidden />
      </Button>
    </Tooltip>
  </>
);
IconOnly.parameters = {
  customStyles: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, auto)',
  },
};

export const IconsOnlyPrimary: StoryFn<typeof Button> = () => (
  <>
    <Button icon variant='primary' data-size='sm'>
      <CogIcon title='Innstillinger' />
    </Button>
    <Button icon variant='primary' data-size='md'>
      <CogIcon title='Innstillinger' />
    </Button>
    <Button icon variant='primary' data-size='lg'>
      <CogIcon title='Innstillinger' />
    </Button>
  </>
);
