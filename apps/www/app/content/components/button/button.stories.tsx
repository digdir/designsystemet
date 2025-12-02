import { Button, type ButtonProps } from '@digdir/designsystemet-react';
import { PencilWritingIcon } from '@navikt/aksel-icons';

export const Preview = () => {
  return <Button>Min knapp</Button>;
};

export const PreviewEn = () => {
  return <Button>My button</Button>;
};

export const Variants = () => {
  return (
    <>
      <Button variant='primary'>Primary</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='tertiary'>Tertiary</Button>
    </>
  );
};

export const ColorVariants = () => {
  const colorVariants = [
    'accent',
    'brand1',
    'brand2',
    'brand3',
    'neutral',
    'danger',
  ];

  return (
    <>
      {colorVariants.map((color) => (
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
};

export const Icons = () => (
  <>
    <Button icon aria-label='Kun ikon'>
      <PencilWritingIcon aria-hidden />
    </Button>
    <Button>
      <PencilWritingIcon aria-hidden />
      Rediger
    </Button>
  </>
);

export const IconsEn = () => (
  <>
    <Button icon aria-label='Icon only'>
      <PencilWritingIcon aria-hidden />
    </Button>
    <Button>
      <PencilWritingIcon aria-hidden />
      Edit
    </Button>
  </>
);

export const CombinedColors = () => (
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
);

export const CombinedColorsEn = () => (
  <>
    <Button variant='primary' data-color='neutral'>
      Publish
    </Button>
    <Button variant='secondary' data-color='neutral'>
      Save draft
    </Button>
    <Button variant='tertiary' data-color='danger'>
      Delete
    </Button>
  </>
);

export const AsLink = () => (
  <Button asChild>
    <a target='_blank' rel='noreferrer' href='https://www.designsystemet.no'>
      Gå til designsystemet.no
    </a>
  </Button>
);

export const AsLinkEn = () => (
  <Button asChild>
    <a target='_blank' rel='noreferrer' href='https://www.designsystemet.no'>
      Go to designsystemet.no
    </a>
  </Button>
);

export const Loading = () => (
  <>
    <Button variant='primary' loading>
      Laster…
    </Button>
    <Button variant='secondary' loading>
      Laster…
    </Button>
    <Button variant='tertiary' loading>
      Laster…
    </Button>
  </>
);

export const LoadingEn = () => (
  <>
    <Button variant='primary' loading>
      Loading…
    </Button>
    <Button variant='secondary' loading>
      Loading…
    </Button>
    <Button variant='tertiary' loading>
      Loading…
    </Button>
  </>
);
