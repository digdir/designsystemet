import React from 'react';
import { Search, ForkSpoonKnife, EmailOpened } from '@navikt/ds-icons';

import classes from './IconSearch.module.css';

export function IconSearch() {
  return (
    <div className={classes.iconSearch}>
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
          <div className={classes.group}>
            <div className={classes.heading}>Accessibility</div>
            <div className={classes.items}>
              <div className={classes.item}>
                <ForkSpoonKnife fontSize={30} />
                <div className={classes.name}>Glasses</div>
              </div>
              <div className={classes.item}>
                <ForkSpoonKnife fontSize={30} />
                <div className={classes.name}>Glasses</div>
              </div>
              <div className={classes.item}>
                <ForkSpoonKnife fontSize={30} />
                <div className={classes.name}>Glasses</div>
              </div>
              <div className={classes.item}>
                <ForkSpoonKnife fontSize={30} />
                <div className={classes.name}>Glasses</div>
              </div>
              <div className={classes.item}>
                <ForkSpoonKnife fontSize={30} />
                <div className={classes.name}>Glasses</div>
              </div>
            </div>
          </div>

          <div className={classes.icons}>
            <div className={classes.group}>
              <div className={classes.heading}>Arrows</div>
              <div className={classes.items}>
                <div className={classes.item}>
                  <EmailOpened fontSize={30} />
                  <div className={classes.name}>Glasses</div>
                </div>
                <div className={classes.item}>
                  <EmailOpened fontSize={30} />
                  <div className={classes.name}>Glasses</div>
                </div>
                <div className={classes.item}>
                  <EmailOpened fontSize={30} />
                  <div className={classes.name}>Glasses</div>
                </div>
                <div className={classes.item}>
                  <EmailOpened fontSize={30} />
                  <div className={classes.name}>Glasses</div>
                </div>
                <div className={classes.item}>
                  <EmailOpened fontSize={30} />
                  <div className={classes.name}>Glasses</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

IconSearch.displayName = 'IconSearch';
