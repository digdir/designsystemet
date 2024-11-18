'use client';
import { Heading } from '@digdir/designsystemet-react';
import { Container } from '@repo/components';
import { ContrastChart } from '../../components/ContrastChart/ContrastChart';
import classes from './page.module.css';

export default function ContrastCharts() {
  return (
    <div>
      <main>
        <Container>
          <div>
            <Heading data-size='lg'>Kontrastoversikt</Heading>
            <Heading className={classes.subHeading} data-size='sm'>
              Light mode
            </Heading>
            <ContrastChart />
            <Heading className={classes.subHeading} data-size='sm'>
              Dark mode
            </Heading>
            <ContrastChart type='dark' />
          </div>
        </Container>
      </main>
    </div>
  );
}
