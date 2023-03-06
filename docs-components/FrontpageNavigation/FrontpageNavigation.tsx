import React from 'react';
import { SystemFilled, Wrench, Picture } from '@navikt/ds-icons';

import type { NavigationCardProps } from '../NavigationCard/NavigationCard';
import { NavigationCard } from '../NavigationCard/NavigationCard';

import classes from './FrontpageNavigation.module.css';

const FrontpageNavigation = () => {
  console.log(window.location);

  const items: NavigationCardProps[] = [
    {
      name: 'For designere',
      desc: 'Lær hvordan du kan komme i gang som designer.',
      url: '/?path=/docs/kom-i-gang-for-designere--page',
      color: 'blue',
      icon: <Picture fontSize={29} />,
    },
    {
      name: 'For utviklere',
      desc: 'Lær hvordan du kan komme i gang som utvikler.',
      url: '/?path=/docs/kom-i-gang-for-utviklere--page',
      color: 'yellow',
      icon: <Wrench fontSize={29} />,
    },
    {
      name: 'Komponenter',
      desc: 'Oversikt over alle React komponentene.',
      url: '/?path=/docs/kjernekomponenter-introduksjon--page',
      color: 'red',
      icon: <SystemFilled fontSize={26} />,
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
          color={item.color}
          icon={item.icon}
        />
      ))}
    </div>
  );
};

export { FrontpageNavigation };
