'use client';
import { Container } from '@repo/components';

import { ContrastChart } from '../../components/ContrastChart/ContrastChart';

export default function ContrastCharts() {
  return (
    <div>
      <main>
        <Container>
          <div>
            <ContrastChart />
          </div>
        </Container>
      </main>
    </div>
  );
}
