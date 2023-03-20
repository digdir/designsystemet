import React from 'react';

import { Container } from '../../components/Container/Container';
import Header from '../../components/Header/Header';

import classes from './UpdateLayout.module.css';

interface PageLayoutProps {
  Content: React.ReactNode;
}

const UpdateLayout = ({ Content }: PageLayoutProps) => {
  return (
    <div>
      <Header />
      <main className={classes.content}>
        <Container>{Content}</Container>
      </main>
    </div>
  );
};

export default UpdateLayout;
