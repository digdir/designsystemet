import React from 'react';

import type { NavigationCardProps } from '../NavigationCard/NavigationCard';
import { NavigationCard } from '../NavigationCard/NavigationCard';

import classes from './FrontpageNavigation.module.css';

const FrontpageNavigation = () => {
  console.log(window.location);

  const items: NavigationCardProps[] = [
    {
      name: 'Komponenter',
      desc: 'Her får du en oversikt over alle React komponentene.',
      url: '/?path=/docs/kjernekomponenter-introduksjon--page',
    },
  ];

  return (
    <div className={classes.items}>
      {items.map((item, index) => (
        <NavigationCard
          key={index}
          name={item.name}
          desc={item.desc}
          url={item.url}
        />
      ))}
    </div>
  );
};

export { FrontpageNavigation };
