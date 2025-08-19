import { Button, type ButtonProps } from '@digdir/designsystemet-react';

export const Preview = () => {
  return <Button>min knapp!</Button>;
};

export const Variants = () => {
  return (
    <>
      <Button variant='primary'>Primary</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='tertiary'>Teritiary</Button>
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
