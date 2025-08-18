import { Button } from '@digdir/designsystemet-react';

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
