import { PencilWritingIcon } from '@navikt/aksel-icons';
import preview from '../../../../../apps/storybook/.storybook/preview';
import { themeColors } from '../../../stories/constants';

import { Button, type ButtonProps } from './button';

const meta = preview.meta({
  title: 'Komponenter/Button',
  component: Button,
  parameters: {
    customStyles: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 'var(--ds-size-4)',
    },
  },
});

export const Preview = meta.story({
  render: ({ ...args }) => {
    return <Button {...args} />;
  },
  args: {
    children: 'Knapp',
    disabled: false,
    variant: 'primary',
    icon: false,
  },
});

export const Variants = meta.story(() => (
  <>
    <Button variant='primary'>Primary</Button>
    <Button variant='secondary'>Secondary</Button>
    <Button variant='tertiary'>Teritiary</Button>
  </>
));

const RenderColors = () => (
  <>
    {[...themeColors, 'danger'].map((color) => (
      <Button
        key={color}
        data-color={color as ButtonProps['data-color']}
        variant='primary'
      >
        {color}
      </Button>
    ))}
  </>
);

export const Colors = meta.story({
  render: RenderColors,
});

export const ColorsHover = meta.story({
  render: RenderColors,

  parameters: {
    pseudo: { hover: true },
    chromatic: { modes: { mobile: { disable: true } } },
  },
});

export const ColorsPressed = meta.story({
  render: RenderColors,

  parameters: {
    pseudo: { active: true },
    chromatic: { modes: { mobile: { disable: true } } },
  },
});

export const Icons = meta.story(() => (
  <>
    <Button icon aria-label='Rediger'>
      <PencilWritingIcon aria-hidden />
    </Button>
    <Button>
      <PencilWritingIcon aria-hidden />
      Rediger
    </Button>
  </>
));

export const CombinedColors = meta.story(() => (
  <>
    <Button variant='primary' data-color='neutral'>
      Publiser
    </Button>
    <Button variant='secondary' data-color='neutral'>
      Lagre kladd
    </Button>
    <Button variant='tertiary' data-color='danger'>
      Slett
    </Button>
  </>
));

export const AsLink = meta.story(() => (
  <Button asChild>
    <a target='_blank' rel='noreferrer' href='https://www.designsystemet.no'>
      Gå til designsystemet.no
    </a>
  </Button>
));

export const Loading = meta.story(() => (
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
    <Button icon loading aria-label='Rediger'>
      {/* When loading is true and icon is set, loading will take precedence */}
      <PencilWritingIcon aria-hidden />
    </Button>
  </>
));
