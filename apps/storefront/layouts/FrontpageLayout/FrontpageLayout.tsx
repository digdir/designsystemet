import type React from 'react';
import { Heading } from '@digdir/design-system-react';
import { PaletteIcon, WrenchIcon, ComponentIcon } from '@navikt/aksel-icons';
import cn from 'clsx';

import { NavigationCard, Container } from '@components';

import classes from './FrontpageLayout.module.css';

type FrontpageLayoutProps = {
  content: React.ReactNode;
};

const FrontpageLayout = ({ content }: FrontpageLayoutProps) => {
  return (
    <main id='main'>
      <div>
        <img
          src='/img/elements/first.svg'
          alt=''
          className={cn(classes.cluster, classes.cluster1, classes.clusterLeft)}
        />
        <img
          src='/img/elements/third.svg'
          alt=''
          className={cn(
            classes.cluster,
            classes.cluster2,
            classes.clusterRight,
          )}
        />
        <img
          src='/img/elements/second.svg'
          alt=''
          className={cn(classes.cluster, classes.cluster3, classes.clusterLeft)}
        />
        <img
          src='/img/elements/fourth.svg'
          alt=''
          className={cn(
            classes.cluster,
            classes.cluster4,
            classes.clusterRight,
          )}
        />
        <img
          src='/img/elements/first.svg'
          alt=''
          className={cn(classes.cluster, classes.cluster5, classes.clusterLeft)}
        />
        <img
          src='/img/elements/third.svg'
          alt=''
          className={cn(
            classes.cluster,
            classes.cluster6,
            classes.clusterRight,
          )}
        />
      </div>
      <div className={classes.header}>
        <div className={classes.content}>
          <Container className={classes.container}>
            <div className={classes.test}>
              <div className={classes.betaTag}>Beta</div>
              <Heading size='xlarge'>
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
                url='/komponenter'
                icon={<ComponentIcon fontSize={34} />}
              ></NavigationCard>
            </div>
          </Container>
        </div>
      </div>
      {content}
    </main>
  );
};

export { FrontpageLayout };
