import React, { useEffect, useState } from 'react';
import { Search } from '@navikt/ds-icons';
import { SvgModal } from 'storybook-components';

import { Motorcycle } from '../../';
import * as Icon from '../../';
import meta from '../../meta.json';

import classes from './IconSearch.module.css';

interface IconProps {
  name: string;
  icon: any;
}

export function IconSearch() {
  const [items, setItems] = useState([]);
  const [activeIcon, setActiveIcon] = useState<IconProps>({
    name: 'Name',
    icon: Motorcycle,
  });
  const [showModal, setShowModal] = useState(false);

  const filterArray = () => {
    let array = [];

    for (const item of meta) {
      if (!array[item.pageName]) {
        array[item.pageName] = [];
      }

      array[item.pageName].push(item);
    }

    array = Object.keys(array)
      .sort()
      .reduce((obj, key) => {
        obj[key] = array[key];
        return obj;
      }, {});

    setItems(array);
  };

  useEffect(() => {
    filterArray();
  }, [setItems]);

  const CustomIcon = ({ name }) => {
    let MyIcon;
    if (Icon[name]) {
      MyIcon = Icon[name];
      return (
        <MyIcon
          height={32}
          width={32}
        />
      );
    } else {
      return <p>Error</p>;
    }
  };

  const onIconClickEvent = (name: string) => {
    setShowModal(true);
    setActiveIcon({ name: name, icon: Icon[name] });
  };

  return (
    <div className={classes.iconSearch}>
      <SvgModal
        name={activeIcon.name}
        Icon={activeIcon.icon}
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        packageName='@digdir/design-system-icons'
      />
      <div className={classes.searchContainer}>
        <div className={classes.iconContainer}>
          <Search fontSize={25} />
        </div>
        <input
          type='text'
          className={classes.input}
          placeholder='Søk etter ikoner'
        />

        <div className={classes.icons}>
          {Object.entries(items).map((groupValue, groupIndex) => (
            <div
              key={groupIndex}
              className={classes.group}
            >
              <h2 className={classes.heading}>{groupValue[0]}</h2>
              <div className={classes.items}>
                {items[groupValue[0]].map(
                  (iconValue: any, iconIndex: number) => (
                    <button
                      onClick={() => onIconClickEvent(iconValue.name)}
                      key={iconIndex}
                      className={classes.item}
                    >
                      <CustomIcon name={iconValue.name} />
                      <div className={classes.name}>{iconValue.name}</div>
                    </button>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

IconSearch.displayName = 'IconSearch';
