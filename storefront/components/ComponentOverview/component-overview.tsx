import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import classes from './component-overview.module.css';

interface BoxProps {
  name: string;
  img: string;
  url: string;
}

const ComponentOverview = () => {
  const items: BoxProps[] = [
    {
      name: 'Button',
      img: 'button.png',
      url: 'button--button',
    },
    {
      name: 'Checkbox',
      img: 'checkbox.png',
      url: 'checkbox--normal',
    },
    {
      name: 'CheckboxGroup',
      img: 'checkbox-group.png',
      url: 'checkboxgroup--vertikal',
    },
    {
      name: 'Fieldset',
      img: 'fieldset.png',
      url: 'fieldset--field-set',
    },
    {
      name: 'HelpText',
      img: 'help-text.png',
      url: 'helptext--help-text',
    },
    {
      name: 'Popover',
      img: 'popover.png',
      url: 'popover--popover',
    },
    {
      name: 'RadioButton',
      img: 'radio-button.png',
      url: 'radiobutton--normal',
    },
    {
      name: 'RadioButtonGroup',
      img: 'radio-button-group.png',
      url: 'radiogroup--vertikal',
    },
    {
      name: 'Select',
      img: 'select.png',
      url: 'select-flervalgsmeny--normal',
    },
    {
      name: 'Tabs',
      img: 'tabs.png',
      url: 'tabs--tabs',
    },
    {
      name: 'TextArea',
      img: 'textarea.png',
      url: 'textarea--standard',
    },
    {
      name: 'TextField',
      img: 'text-field.png',
      url: 'textfield--standard',
    },
  ];

  return (
    <div className={classes.items}>
      {items.map((item, index) => (
        <Link
          href='/komponenter/button'
          className={classes.box}
          key={index}
        >
          <div className={classes.container}>
            <img
              src={'/img/component-previews/' + item.img}
              alt=''
            />
          </div>
          <div className={classes.name}>{item.name}</div>
        </Link>
      ))}
    </div>
  );
};

export { ComponentOverview };
