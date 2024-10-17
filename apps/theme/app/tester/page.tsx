'use client';
import { Container } from '@repo/components';
import Link from 'next/link';
import classes from './page.module.css';

export default function Home() {
  return (
    <div className={classes.page}>
      <main>
        <Container>
          <h1 className={classes.title}>Tester</h1>
          <p className={classes.ingress}>
            Denne siden inneholder en oversikt over ulike testsider for
            fargesystemet som vi i Designsystemet bruker internt for å sikre at
            systemet fungerer slik vi ønsker.
          </p>
        </Container>
        <Link href='/tester/balanse'>Balanse mellom farger</Link>
      </main>
    </div>
  );
}
