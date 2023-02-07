import React from 'react';

import classes from './TableOfContents.module.css';

const TableOfContents = () => {
  return (
    <div className={classes.toc}>
      <h3 className={classes.title}>Innhold på siden</h3>
      <ul className={classes.list}>
        <li className={classes.item}>
          <a
            className={classes.link}
            href='#'
          >
            Varianter
          </a>
        </li>
        <li className={classes.item}>
          <a
            className={classes.link}
            href='#'
          >
            Bruk
          </a>
        </li>
        <li className={classes.item}>
          <a
            className={classes.link}
            href='#'
          >
            Størrelser
          </a>
        </li>
        <li className={classes.item}>
          <a
            className={classes.link}
            href='#'
          >
            Tilgjengelighet
          </a>
        </li>
      </ul>
    </div>
  );
};

export { TableOfContents };
