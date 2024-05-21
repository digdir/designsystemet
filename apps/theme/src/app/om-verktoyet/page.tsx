'use client';

import { Container } from '../components/Container/Container';
import { Header } from '../components/Header/Header';

import classes from './page.module.css';

export default function Home() {
  return (
    <div className={classes.page}>
      <Header />
      <main>
        <Container>
          <h1 className={classes.title}>Om verktøyet</h1>
          <p className={classes.ingress}>
            Dette er et test-verktøy som genererer farger basert på HSLUV
            fargespekteret og legger til RGB interpolasjon for å få menneskelige
            fine farger.
          </p>
        </Container>
      </main>
    </div>
  );
}
