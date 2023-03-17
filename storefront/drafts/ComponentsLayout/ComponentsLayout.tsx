import React from 'react';

import { Container } from '../../components/Container/Container';
import Header from '../../components/Header/Header';

import classes from './ComponentsLayout.module.css';

interface ComponentsLayoutProps {
  Content: React.ReactNode;
  data: {
    title: string;
    description: string;
  };
  menu: {
    title: string;
    showMenu: boolean;
    items: [];
  };
}

const ComponentsLayout = ({ Content, data }: ComponentsLayoutProps) => {
  return (
    <div>
      <Header />
      <div className={classes.content}>
        <Container>
          <div>
            <h1 className={classes.title}>{data.title}</h1>
            <p className={classes.desc}>{data.description}</p>
            <div className={classes.items}></div>
          </div>
        </Container>
      </div>
      {Content}
    </div>
  );
};

export { ComponentsLayout };
