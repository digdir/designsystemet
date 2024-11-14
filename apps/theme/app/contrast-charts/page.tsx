'use client';
import { Container } from '@repo/components';

import { ContrastChart } from '../../components/ContrastChart/ContrastChart';
import classes from './page.module.css';

export default function ContrastCharts() {
  return (
    <div className={classes.page}>
      <main>
        <Container>
          <div className={classes.row}>
            <ContrastChart />
          </div>
        </Container>
      </main>
    </div>
  );
}
