import React, { useEffect, useState } from 'react';

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
      img: 'help-text.png',
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

  const setUrl = (url) => {
    if (window.location.href.includes('localhost')) {
      return '/?path=/docs/kjernekomponenter-' + url;
    } else {
      return '/designsystem/?path=/docs/kjernekomponenter-' + url;
    }
  };

  const setPathPrefix = () => {
    return window.location.href.includes('localhost') ? '' : '/designsystem/';
  };

  return (
    <div className={classes.items}>
      {items.map((item, index) => (
        <a
          href={setUrl(item.url)}
          className={classes.box}
        >
          <div className={classes.container}>
            <img
              src={setPathPrefix() + '/img/component-placeholders/' + item.img}
              alt=''
            />
          </div>
          <div className={classes.name}>{item.name}</div>
        </a>
      ))}
    </div>
  );
};

export { ComponentOverview };
