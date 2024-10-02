import { Textfield as DSTextfield } from '@digdir/designsystemet-react';

type TextfieldProps = {
  label: string;
  size?: 'sm' | 'md' | 'lg';
};

export const Textfield = ({ ...rest }: TextfieldProps) => {
  return <DSTextfield {...rest} />;
};
