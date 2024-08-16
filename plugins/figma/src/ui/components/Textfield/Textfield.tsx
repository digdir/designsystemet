import { Textfield as DSTextfield } from '@digdir/designsystemet-react';

import classes from './Textfield.module.css';
type TextfieldProps = {
  label: string;
  size?: 'sm' | 'md' | 'lg';
};

export const Textfield = ({ ...rest }: TextfieldProps) => {
  return (
    <DSTextfield
      {...rest}
      className={classes.input}
    />
  );
};
