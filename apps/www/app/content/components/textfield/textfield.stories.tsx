import { Tag, Textfield } from '@digdir/designsystemet-react';

export const Preview = () => {
  return <Textfield label='Label' />;
};

export const WithRows = () => {
  return <Textfield label='Label' multiline rows={4} />;
};

export const WithAffix = () => {
  return (
    <Textfield
      prefix='NOK'
      suffix='pr. mnd'
      label='Hvor mange kroner koster det per måned?'
    />
  );
};

export const WithCounter = () => {
  return (
    <Textfield counter={10} label='Hvor mange kroner koster det per måned?' />
  );
};

export const Required = () => (
  <Textfield
    label={
      <>
        Hvor bor du?
        <Tag
          data-color='warning'
          style={{ marginInlineStart: 'var(--ds-size-2)' }}
        >
          Må fylles ut
        </Tag>
      </>
    }
    required
  />
);
