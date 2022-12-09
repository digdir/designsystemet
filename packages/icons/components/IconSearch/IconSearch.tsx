import React, { useEffect, useState } from 'react';
import { Search } from '@navikt/ds-icons';
import { differenceInDays } from 'date-fns';

import { SvgModal } from '../../../../docs-components';
import { Motorcycle, Close } from '../../';
import * as Icon from '../../';
import meta from '../../meta.json';

import classes from './IconSearch.module.css';
import cn from 'classnames';

interface IconProps {
  name: string;
  icon: any;
  isNew: boolean;
}

export function IconSearch() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState('alle');
  const [search, setSearch] = useState('');
  const [activeIcon, setActiveIcon] = useState<IconProps>({
    name: 'Name',
    icon: Motorcycle,
    isNew: false,
  });
  const [showModal, setShowModal] = useState(false);

  const filterArray = (search: string, newTab: string) => {
    let array = [];

    for (const item of meta) {
      if (!array[item.pageName]) {
        array[item.pageName] = [];
      }

      if (
        search.toLowerCase() === '' ||
        item.name.toLowerCase().includes(search)
      ) {
        if (newTab === 'alle' || !newTab) {
          array[item.pageName].push(item);
        } else if (newTab === 'filled') {
          if (item.name.includes('Filled')) {
            array[item.pageName].push(item);
          }
        } else {
          if (isIconNew(item.created_at)) {
            array[item.pageName].push(item);
          }
        }
      }
    }

    array = Object.keys(array)
      .sort()
      .reduce((obj, key) => {
        obj[key] = array[key];
        return obj;
      }, {});

    console.log(search);

    setItems(array);
  };

  useEffect(() => {
    filterArray('', 'alle');
  }, []);

  const isIconNew = (date: string) => {
    const iconDate = new Date(date);
    const days = differenceInDays(new Date(), iconDate);
    return days < 200;
  };

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

  const onIconClickEvent = (icon: string) => {
    setShowModal(true);
    setActiveIcon({
      name: icon.name,
      icon: Icon[icon.name],
      isNew: isIconNew(icon.created_at),
    });
  };

  const onSearch = (e) => {
    let search = e.target.value;
    setSearch(search);
    filterArray(search, tab);
  };

  const onTab = (newTab: string) => {
    setTab(newTab);
    filterArray(search, newTab);
  };

  const onClear = () => {
    setSearch('');
    setTab('alle');
    filterArray('', 'alle');
  };

  return (
    <div className={classes.iconSearch}>
      <SvgModal
        name={activeIcon.name}
        Icon={activeIcon.icon}
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        packageName='@digdir/design-system-icons'
        newIcon={activeIcon.isNew}
      />
      <div className={classes.searchContainer}>
        <div className={classes.inputContainer}>
          <div className={classes.iconContainer}>
            <Search
              fontSize={25}
              color='#626262'
            />
          </div>
          {search.length > 0 ? (
            <button className={classes.clearBtn}>
              <Close
                onClick={() => onClear()}
                height={21}
                width={21}
              />
            </button>
          ) : (
            ''
          )}
          <input
            onChange={(e) => onSearch(e)}
            type='text'
            value={search}
            className={classes.input}
            placeholder='Søk etter ikoner'
          />
        </div>
        <div className={classes['icons-tabs']}>
          <button
            onClick={() => onTab('alle')}
            className={cn(classes['icons-tabs__btn'], {
              [classes['icons-tabs__btn--active']]: tab === 'alle',
            })}
          >
            Alle
          </button>
          <button
            onClick={() => onTab('filled')}
            className={cn(classes['icons-tabs__btn'], {
              [classes['icons-tabs__btn--active']]: tab === 'filled',
            })}
          >
            Filled
          </button>
          <button
            onClick={() => onTab('nye')}
            className={cn(classes['icons-tabs__btn'], {
              [classes['icons-tabs__btn--active']]: tab === 'nye',
            })}
          >
            Nye
          </button>
        </div>

        <div className={classes.icons}>
          {Object.entries(items).map((groupValue, groupIndex) => (
            <div
              key={groupIndex}
              className={classes.group}
            >
              {items[groupValue[0]].length > 0 ? (
                <>
                  <h2 className={classes.heading}>{groupValue[0]}</h2>
                  <div className={classes.items}>
                    {items[groupValue[0]].map(
                      (iconValue: any, iconIndex: number) => (
                        <button
                          onClick={() => onIconClickEvent(iconValue)}
                          key={iconIndex}
                          className={classes.item}
                        >
                          <CustomIcon name={iconValue.name} />
                          <div className={classes.name}>{iconValue.name}</div>
                          {isIconNew(iconValue.created_at) ? (
                            <div className={classes.new}>Ny!</div>
                          ) : (
                            ''
                          )}
                        </button>
                      ),
                    )}
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

IconSearch.displayName = 'IconSearch';
