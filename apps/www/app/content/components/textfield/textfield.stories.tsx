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

export const WithAffixEn = () => {
  return (
    <Textfield
      prefix='GBP'
      suffix='per month'
      label='How much does it cost per month?'
    />
  );
};

export const WithCounter = () => {
  return (
    <Textfield counter={10} label='Hvor mange kroner koster det per måned?' />
  );
};

export const WithCounterEn = () => {
  return (
    <Textfield counter={10} label='How many pounds does it cost per month?' />
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

export const RequiredEn = () => (
  <Textfield
    label={
      <>
        Where do you live?
        <Tag
          data-color='warning'
          style={{ marginInlineStart: 'var(--ds-size-2)' }}
        >
          Required
        </Tag>
      </>
    }
    required
  />
);
