import React from 'react';
import cn from 'classnames';
import Tippy from '@tippyjs/react';

import classes from './ArgsTable.module.css';

interface ArgsTable {
  argTypes: any;
}

const ArgsTable = ({ argTypes }: ArgsTable) => {
  const getTypeClass = (type: string) => {
    if (
      type === 'string' ||
      type === 'boolean' ||
      type === 'number' ||
      type === 'function'
    ) {
      return type;
    } else {
      return 'custom';
    }
  };

  const getOptions = (options: any) => {
    let s = '';
    for (let i = 0; i < options.length; i++) {
      if (i === 0) {
        s += options[i];
      } else {
        s += ' | ' + options[i];
      }
    }
    return s;
  };

  return (
    <div className={classes.table}>
      {Object.keys(argTypes).map((item, index) => (
        <div
          key={index}
          className={classes.items}
        >
          <div className={classes.item}>
            <div className={classes.top}>
              {argTypes[item].defaultValue && (
                <Tippy
                  content={argTypes[item].defaultValue}
                  hideOnClick={false}
                >
                  <div className={cn(classes.name, classes['default'])}>
                    <span>{item}</span>
                    <span>?</span>
                  </div>
                </Tippy>
              )}

              {!argTypes[item].defaultValue && (
                <div
                  className={cn(classes.name, {
                    [classes.required]: argTypes[item].required,
                  })}
                >
                  <span>{item}</span>
                  {argTypes[item].required && <span>*</span>}
                </div>
              )}

              <span
                className={cn(
                  classes.tag,
                  classes[getTypeClass(argTypes[item].type)],
                )}
              >
                {argTypes[item].type}
              </span>
              {argTypes[item].values && (
                <span className={classes.options}>
                  {getOptions(argTypes[item].values)}
                </span>
              )}
            </div>
            {argTypes[item].description && (
              <div className={classes.desc}>{argTypes[item].description}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export { ArgsTable };
