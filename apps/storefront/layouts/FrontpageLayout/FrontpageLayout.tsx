import React from 'react';

import classes from './FrontPageLayout.module.css';
import { Heading } from '@digdir/design-system-react';
import { NavigationCard, Container, ElementCluster } from '@components';
import { PaletteIcon, WrenchIcon, ComponentIcon } from '@navikt/aksel-icons';

type FrontpageLayoutProps = {
  content: React.ReactNode;
};

const FrontpageLayout = ({ content }: FrontpageLayoutProps) => {
  return (
    <main id='main'>
      <div className={classes.header}>
        <div className={classes.content}>
          <ElementCluster className={classes.cluster1} />
          <ElementCluster className={classes.cluster2} />
          <Container className={classes.container}>
            <div className={classes.test}>
              <Heading size='large'>
                Designsystemet hjelper deg å lage gode digitale tjenester
              </Heading>
            </div>
            <div className={classes.cards}>
              <NavigationCard
                title='For designere'
                description='Lær hvordan du kommer i gang med designsystemet som designer.'
                color='blue'
                url='/grunnleggende/for-designere/kom-i-gang'
                icon={<PaletteIcon fontSize={36} />}
              ></NavigationCard>

              <NavigationCard
                title='For utviklere'
                description='Lær hvordan du kommer i gang med designsystemet som utvikler.'
                color='yellow'
                url='/grunnleggende/for-utviklere/kom-i-gang'
                icon={<WrenchIcon fontSize={36} />}
              ></NavigationCard>

              <NavigationCard
                title='Komponenter'
                description='Se oversikten over UI-komponentene som er laget i react.'
                color='red'
                url='https://storybook.designsystemet.no'
                icon={<ComponentIcon fontSize={34} />}
              ></NavigationCard>
            </div>
          </Container>
        </div>
      </div>
    </main>
  );
};

export { FrontpageLayout };
