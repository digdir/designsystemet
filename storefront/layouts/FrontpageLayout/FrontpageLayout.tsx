import React from 'react';

import {
  Section,
  NavigationCard,
  Banner,
  ImageSection,
} from '../../components';
import type { NavigationCardProps, ImageSectionProps } from '../../components';

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
  contributeSection: ImageSectionProps;
}

const FrontpageLayout = ({ Content, data }: FrontpageLayoutProps) => {
  return (
    <main id='main'>
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
          imgSrc={data.contributeSection.imgSrc}
          imgAlt={data.contributeSection.imgAlt}
          headingLevel={data.contributeSection.headingLevel}
          imgWidth={data.contributeSection.imgWidth}
          imgHeight={data.contributeSection.imgHeight}
          buttons={data.contributeSection.buttons}
        />
      </div>
    </main>
  );
};

export { FrontpageLayout };
export type { FrontpageData };
