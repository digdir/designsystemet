import React from 'react';
import { Col, Row } from 'react-bootstrap';

import Header from '../../components/Header/Header';
import Section from '../../components/Section/Section';
import NavigationCard from '../../components/NavigationCard/NavigationCard';
import Banner from '../../components/Banner/Banner';
import { Card } from '../../components/Card/Card';
import { ImageSection } from '../../components/ImageSection/ImageSection';
import { Email } from '@navikt/ds-icons';

import classes from './FrontpageLayout.module.css';

interface FrontpageLayoutProps {
  Content: React.ReactNode;
  data: any;
}

interface FrontpageData {
  title: string;
  description: string;
  navigationCards: {
    title: string;
    description: string;
    items: any[];
  };
}

const FrontpageLayout = ({ Content, data }: FrontpageLayoutProps) => {
  return (
    <div>
      <Header />
      {Content}
      <div className='max-width-container main'>
        <Banner
          title={data.title}
          desc={data.description}
        />

        <Section title={data.navigationCards.title}>
          <Row className='gy-4'>
            {data.navigationCards.items.map((item: any, index: number) => (
              <Col
                key={index}
                md={4}
              >
                <NavigationCard
                  url={item.url}
                  title={item.title}
                  color={item.color}
                  icon={item.icon}
                  description={item.description}
                />
              </Col>
            ))}
          </Row>
        </Section>

        <ImageSection
          id='bidra'
          title='Ønsker du å bidra?'
          description='Vi ønsker at dette skal bli et felles hjem for gjenbrukbare
            komponenter, god praksis, interaksjonsmønstre, brukerdialog, innsikt
            og mer. Målet er at innbyggere skal oppleve offentlige tjenester mer
            helhetlig, ved at vi bygger tjenestene våre på det samme fundamentet
            og med de samme retningslinjene.        Vil du høre mer om dette, eller samarbeide med oss? Ta kontakt med
            oss på e-post.'
          src='img/share.svg'
          content={
            <a
              href='mailto:designsystem@digdir.no'
              className={classes.link}
            >
              <Email fontSize={26} />
              <span>Ta kontakt med oss på e-post.</span>
            </a>
          }
        />

        {/*<Section*/}
        {/*  backgroundColor='grey'*/}
        {/*  title='Siste oppdateringer'*/}
        {/*>*/}
        {/*  <Row className='gy-4'>*/}
        {/*    <Col md={4}>*/}
        {/*      <Card*/}
        {/*        title='Oppdatering Q2'*/}
        {/*        description='And human of of folks friendly a by bed every assignment. Mr. Cheek, coast to a frequency mouse your the sports. Everything and, there throughout. Of cons, to out presented. The front casting his dropped what determined investigating after been semblance if go the duties, is to stage so our.'*/}
        {/*        url='#'*/}
        {/*      />*/}
        {/*    </Col>*/}
        {/*    <Col md={4}>*/}
        {/*      <Card*/}
        {/*        title='Oppdatering Q2'*/}
        {/*        description='And human of of folks friendly a by bed every assignment. Mr. Cheek, coast to a frequency mouse your the sports. Everything and, there throughout. Of cons, to out presented. The front casting his dropped what determined investigating after been semblance if go the duties, is to stage so our.'*/}
        {/*        url='#'*/}
        {/*      />*/}
        {/*    </Col>*/}
        {/*    <Col md={4}>*/}
        {/*      <Card*/}
        {/*        title='Oppdatering Q2'*/}
        {/*        description='And human of of folks friendly a by bed every assignment. Mr. Cheek, coast to a frequency mouse your the sports. Everything and, there throughout. Of cons, to out presented. The front casting his dropped what determined investigating after been semblance if go the duties, is to stage so our.'*/}
        {/*        url='#'*/}
        {/*      />*/}
        {/*    </Col>*/}
        {/*  </Row>*/}
        {/*</Section>*/}
      </div>
    </div>
  );
};

export { FrontpageLayout };
export type { FrontpageData };
