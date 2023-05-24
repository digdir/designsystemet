import React from 'react';

import Section from '../../components/Section/Section';
import type { NavigationCardProps } from '../../components/NavigationCard/NavigationCard';
import { NavigationCard } from '../../components/NavigationCard/NavigationCard';
import Banner from '../../components/Banner/Banner';
import type { ButtonProps } from '../../components/ImageSection/ImageSection';
import { ImageSection } from '../../components/ImageSection/ImageSection';

import classes from './FrontpageLayout.module.css';

interface FrontpageLayoutProps {
  Content: React.ReactNode;
  data: FrontpageData;
}

interface FrontpageData {
  title: string;
  description: string;
  navigationCards: {
    title: string;
    description: string;
    items: [];
  };
  contributeSection: {
    title: string;
    description: string;
    email: string;
    image: string;
    imageWidth: number;
    imageHeight: number;
    buttons?: ButtonProps[];
  };
}

const FrontpageLayout = ({ Content, data }: FrontpageLayoutProps) => {
  return (
    <div>
      {Content}
      <div className='max-width-container main'>
        <Banner
          title={data.title}
          desc={data.description}
        />

        <Section title={data.navigationCards.title}>
          {data.navigationCards.items.map(
            (item: NavigationCardProps, index: number) => (
              <NavigationCard
                key={index}
                url={item.url}
                title={item.title}
                color={item.color}
                icon={item.icon}
                description={item.description}
              />
            ),
          )}
        </Section>

        <ImageSection
          title={data.contributeSection.title}
          description={data.contributeSection.description}
          src={data.contributeSection.image}
          imgWidth={data.contributeSection.imageWidth}
          imgHeight={data.contributeSection.imageHeight}
          buttons={data.contributeSection.buttons}
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
