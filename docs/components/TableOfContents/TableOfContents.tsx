import React from 'react';

import classes from './TableOfContents.module.css';

export interface TomatoProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Tomato() {
  return (
    <div className={classes.test}>
      <div className={classes.heading}>Innhold på siden</div>
      <ul className={classes.list}>
          <li>Kom i gang</li>
          <li>Tilgjengelighet</li>
          <li>Bruk</li>
          <li>Changelog</li>
      </ul>
    </div>
  );
}

Tomato.displayName = 'Button';
