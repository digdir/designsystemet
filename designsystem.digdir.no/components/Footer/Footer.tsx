import React from 'react';
import { Container } from 'react-bootstrap';

import classes from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <Container>
        <img
          src='/img/logo-negative.svg'
          alt='Logo'
        />
      </Container>
    </footer>
  );
};

export { Footer };
