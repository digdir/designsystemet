import React from 'react';

import classes from './FrontPageLayout.module.css';
import { Heading } from '@digdir/design-system-react';
import { NavigationCard, Container, ImageBanner } from '@components';
import { PaletteIcon, WrenchIcon, ComponentIcon } from '@navikt/aksel-icons';

type FrontpageLayoutProps = {
  content: React.ReactNode;
};

const FrontpageLayout = ({ content }: FrontpageLayoutProps) => {
  return (
    <main id='main'>
      <div className={classes.header}>
        <div className={classes.content}>
          <img
            src='/img/elements/first.svg'
            alt='test'
            className={classes.cluster1}
          />
          <img
            src='/img/elements/third.svg'
            alt='test'
            className={classes.cluster2}
          />
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

      <ImageBanner
        title='Bli med på samarbeidet?'
        description='Et samarbeid om designsystem kan bidra til mer helhetlige brukeropplevelser på tvers av offentlig sektor og samtidig spare oss for å gjøre de samme oppgavene flere ganger. Vi ønsker at dette skal bli et felles hjem for gjenbrukbare komponenter, god praksis, interaksjonsmønstre, brukerdialog, innsikt og mer. Vil du høre mer om dette, eller bli med på samarbeidet?'
        imgSrc='/img/people-holding-figures.svg'
        imgAlt='Bilde av 2 personer som går bortover med byggeklosser under armene'
        headingLevel='h2'
        imgWidth={1195}
        imgHeight={270}
      />
      <ImageBanner
        title='Bli med på samarbeidet?'
        description='Et samarbeid om designsystem kan bidra til mer helhetlige brukeropplevelser på tvers av offentlig sektor og samtidig spare oss for å gjøre de samme oppgavene flere ganger. Vi ønsker at dette skal bli et felles hjem for gjenbrukbare komponenter, god praksis, interaksjonsmønstre, brukerdialog, innsikt og mer. Vil du høre mer om dette, eller bli med på samarbeidet?'
        imgSrc='/img/people-holding-figures.svg'
        imgAlt='Bilde av 2 personer som går bortover med byggeklosser under armene'
        headingLevel='h2'
        imgWidth={1195}
        imgHeight={270}
        imgPosition='right'
      />
      <ImageBanner
        title='Bli med på samarbeidet?'
        description='Et samarbeid om designsystem kan bidra til mer helhetlige brukeropplevelser på tvers av offentlig sektor og samtidig spare oss for å gjøre de samme oppgavene flere ganger. Vi ønsker at dette skal bli et felles hjem for gjenbrukbare komponenter, god praksis, interaksjonsmønstre, brukerdialog, innsikt og mer. Vil du høre mer om dette, eller bli med på samarbeidet?'
        imgSrc='/img/people-holding-figures.svg'
        imgAlt='Bilde av 2 personer som går bortover med byggeklosser under armene'
        headingLevel='h2'
        imgWidth={1195}
        imgHeight={270}
      />
    </main>
  );
};

export { FrontpageLayout };
