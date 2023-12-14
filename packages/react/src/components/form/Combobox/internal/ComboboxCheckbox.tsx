import React from 'react';
import cn from 'classnames';

import { Paragraph } from '../../../Typography';
import classes from '../../Checkbox/Checkbox.module.css';
import comboboxClasses from '../Combobox.module.css';
import { CheckboxIcon } from '../../Checkbox/Checkbox';

export default function ComboboxCheckbox({
  size,
  checked,
  className,
}: {
  size?: 'small' | 'medium' | 'large';
  checked?: boolean;
  className?: string;
}) {
  return (
    <Paragraph
      as='div'
      size={size}
      className={cn(
        classes.container,
        className,
        checked && comboboxClasses.showChecked,
      )}
    >
      <span className={cn(classes.control, classes.checkbox)}>
        <div className={classes.input}></div>
        <CheckboxIcon className={cn(classes.icon)} />
      </span>
    </Paragraph>
  );
}
