import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { SvgModal } from 'storybook-components';

import { Altinn } from '../../';
import * as Logo from '../../';
import meta from '../../meta.json';

import classes from './LogoList.module.css';

interface IconProps {
  name: string;
  icon: any;
}

export function LogoList() {
  const [items, setItems] = useState([]);
  const [activeIcon, setActiveIcon] = useState<IconProps>({
    name: 'Name',
    icon: Altinn,
  });
  const [showModal, setShowModal] = useState(false);

  const filterArray = () => {
    let array = [];

    for (let item of meta) {
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
    if (Logo[name]) {
      MyIcon = Logo[name];
      return <MyIcon />;
    } else {
      return <p>Error</p>;
    }
  };

  const onLogoClickEvent = (name: string) => {
    setShowModal(true);
    setActiveIcon({ name: name, icon: Logo[name] });
  };

  return (
    <div className={classes.iconSearch}>
      <SvgModal
        name={activeIcon.name}
        Icon={activeIcon.icon}
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        packageName='@digdir/design-system-logo'
      />

      <div className={classes.searchContainer}>
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
                      onClick={() => onLogoClickEvent(iconValue.name)}
                      key={iconIndex}
                      className={cn(classes.item, {
                        [classes['item--black']]:
                          iconValue.name.includes('Negative'),
                      })}
                    >
                      <CustomIcon name={iconValue.name} />
                      <div
                        className={cn(classes.name, {
                          [classes['name--white']]:
                            iconValue.name.includes('Negative'),
                        })}
                      >
                        {iconValue.name}
                      </div>
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

LogoList.displayName = 'IconSearch';
