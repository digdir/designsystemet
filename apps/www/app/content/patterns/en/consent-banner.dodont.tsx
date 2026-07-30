import {
  Button,
  Checkbox,
  Divider,
  Fieldset,
  Link,
  Paragraph,
  useCheckboxGroup,
} from '@digdir/designsystemet-react';

export const DontNegations = () => {
  return (
    <Paragraph>
      Do you want us to not store information about you and your usage patterns?
    </Paragraph>
  );
};

export const DoNegations = () => {
  return (
    <Paragraph>
      Can we collect information about how you use this website?
    </Paragraph>
  );
};

export const DontButtons1 = () => {
  return (
    <>
      <Button variant='primary'>No, I don't want a better experience</Button>
      <Button variant='primary'>Yes, I want to help</Button>
      <Button variant='primary'>Accept recommended</Button>
      <Button variant='primary'>OK</Button>
      <Button variant='primary'>I understand</Button>
    </>
  );
};

export const DoButtons1 = () => {
  return (
    <>
      <Button variant='primary'>Yes</Button>
      <Button variant='primary'>No</Button>
      <Divider />
      <Button variant='primary'>Accept</Button>
      <Button variant='primary'>Reject</Button>
    </>
  );
};

export const DontButtons2 = () => {
  return <Button variant='primary'>Accept necessary</Button>;
};

export const DoButtons2 = () => {
  return (
    <>
      <Button variant='primary'>Yes</Button>
      <Button variant='primary'>No</Button>
    </>
  );
};

export const DontNecessaryCookiesCheckbox = () => {
  const { getCheckboxProps } = useCheckboxGroup({
    value: ['necessary'],
  });

  return (
    <Fieldset>
      <Fieldset.Legend>What information may we collect?</Fieldset.Legend>
      <Checkbox
        label='Necessary Cookies'
        {...getCheckboxProps({
          disabled: true,
          value: 'necessary',
        })}
      />
      <Checkbox label='Statistics about the website usage' />
    </Fieldset>
  );
};

export const DoNecessaryCookiesCheckbox = () => {
  return (
    <Paragraph>
      <Link href='#necessary-information' style={{ color: 'inherit' }}>
        We also collect information that is required
      </Link>{' '}
      for the website to function properly and securely. This information cannot be opted out of.
    </Paragraph>
  );
};
