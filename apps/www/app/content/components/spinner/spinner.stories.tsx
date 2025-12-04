import { Paragraph, Spinner } from '@digdir/designsystemet-react';

export const Preview = () => {
  return <Spinner aria-label='Henter kaffi' />;
};

export const PreviewEn = () => {
  return <Spinner aria-label='Loading coffee' />;
};

export const Sizes = () => {
  return (
    <>
      <Spinner aria-label='Henter kaffi' data-size='2xs' />
      <Spinner aria-label='Henter kaffi' data-size='xs' />
      <Spinner aria-label='Henter kaffi' data-size='sm' />
      <Spinner aria-label='Henter kaffi' data-size='md' />
      <Spinner aria-label='Henter kaffi' data-size='lg' />
      <Spinner aria-label='Henter kaffi' data-size='xl' />
    </>
  );
};

export const SizesEn = () => {
  return (
    <>
      <Spinner aria-label='Loading coffee' data-size='2xs' />
      <Spinner aria-label='Loading coffee' data-size='xs' />
      <Spinner aria-label='Loading coffee' data-size='sm' />
      <Spinner aria-label='Loading coffee' data-size='md' />
      <Spinner aria-label='Loading coffee' data-size='lg' />
      <Spinner aria-label='Loading coffee' data-size='xl' />
    </>
  );
};

export const Text = () => {
  return (
    <>
      <Spinner aria-label='Preparing' data-size='sm' />
      <Paragraph>Forbereder filen din</Paragraph>
    </>
  );
};

export const TextEn = () => {
  return (
    <>
      <Spinner aria-label='Preparing' data-size='sm' />
      <Paragraph>Preparing your file</Paragraph>
    </>
  );
};
