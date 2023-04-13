import React from 'react';

import classes from './component-overview.module.css';

interface BoxProps {
  name: string;
  img: string;
  url: string;
}

const ComponentOverview = () => {
  const items: BoxProps[] = [
    {
      name: 'LegacyAccordion',
      img: 'LegacyAccordion.png',
      url: 'LegacyAccordion',
    },
    {
      name: 'Button',
      img: 'button.png',
      url: 'button',
    },
    {
      name: 'Checkbox',
      img: 'checkbox.png',
      url: 'checkbox',
    },
    {
      name: 'CheckboxGroup',
      img: 'checkbox-group.png',
      url: 'checkboxgroup',
    },
    {
      name: 'Fieldset',
      img: 'fieldset.png',
      url: 'fieldset',
    },
    {
      name: 'HelpText',
      img: 'help-text.png',
      url: 'helptext',
    },
    {
      name: 'List',
      img: 'list.png',
      url: 'list',
    },
    {
      name: 'Popover',
      img: 'popover.png',
      url: 'popover',
    },
    {
      name: 'RadioButton',
      img: 'radio-button.png',
      url: 'radiobutton',
    },
    {
      name: 'RadioButtonGroup',
      img: 'radio-button-group.png',
      url: 'radiogroup',
    },
    {
      name: 'Select',
      img: 'select.png',
      url: 'select-flervalgsmeny',
    },
    {
      name: 'Spinner',
      img: 'spinner.png',
      url: 'spinner',
    },
    {
      name: 'Table',
      img: 'table.png',
      url: 'table',
    },
    {
      name: 'Tabs',
      img: 'tabs.png',
      url: 'tabs',
    },
    {
      name: 'TextArea',
      img: 'textarea.png',
      url: 'textarea',
    },
    {
      name: 'TextField',
      img: 'text-field.png',
      url: 'textfield',
    },
    {
      name: 'ToggleButtonGroup',
      img: 'toggle-button.png',
      url: 'togglebuttongroup',
    },
  ];

  const setUrl = (url: string) => {
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
          key={index}
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
