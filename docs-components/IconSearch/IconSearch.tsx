import type { ChangeEvent } from 'react';
import React, { useMemo, useState } from 'react';
import { Search } from '@navikt/ds-icons';
import { differenceInDays } from 'date-fns';
import cn from 'classnames';

import { Close } from '../../packages/icons/dist/cjs';
import meta from '../../packages/icons/meta.json';

import classes from './IconSearch.module.css';

type IconType = typeof meta[0];

type AvailableTabs = 'alle' | 'filled' | 'nye';

const isIconNew = (icon: IconType) => {
  const { created_at } = icon;
  const iconDate = new Date(created_at);
  const days = differenceInDays(new Date(), iconDate);
  return days < 200;
};

export function IconSearch() {
  const [tab, setTab] = useState<AvailableTabs>('alle');
  const [searchText, setSearchText] = useState<string>('');

  const items = useMemo(() => {
    if (tab === 'nye') {
      return meta.filter(isIconNew);
    }
    return meta.filter(({ name }) => {
      const name_ = name.toLowerCase();

      return (
        name_.includes(searchText.toLowerCase()) &&
        name_.includes(tab === 'filled' ? tab : '')
      );
    });
  }, [searchText, tab]);

  const onSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);

  const onTab = (newTab: AvailableTabs) => setTab(newTab);

  const onClear = () => {
    setSearchText('');
    setTab('alle');
  };

  const groupedItems = items.reduce<Record<string, IconType[]>>((acc, item) => {
    const collection = acc[item.pageName];

    if (Array.isArray(collection)) {
      return {
        ...acc,
        [item.pageName]: [...collection, item],
      };
    }
    return {
      ...acc,
      [item.pageName]: [],
    };
  }, {});

  return (
    <div className={classes.iconSearch}>
      <div className={classes.searchContainer}>
        <div className={classes.inputContainer}>
          <div className={classes.iconContainer}>
            <Search
              fontSize={25}
              color='#626262'
            />
          </div>
          {searchText.length > 0 ? (
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
            value={searchText}
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
          {Object.entries(groupedItems).map(([groupName, icons]) => (
            <div
              key={groupName}
              className={classes.group}
            >
              {icons.length > 0 ? (
                <>
                  <h2 className={classes.heading}>{groupName}</h2>
                  <div className={classes.items}>
                    {icons.map((icon: IconType, iconIndex: number) => (
                      <div
                        key={iconIndex}
                        className={classes.item}
                      >
                        <div className={classes.name}>{icon.name}</div>
                        {/* TOOD Missing icon preview */}
                        {isIconNew(icon) ? (
                          <div className={classes.new}>Ny!</div>
                        ) : (
                          ''
                        )}
                      </div>
                    ))}
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
