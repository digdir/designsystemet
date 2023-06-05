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
          alt={data.contributeSection.imageAlt}
          headingLevel={data.contributeSection.headingLevel}
          imgWidth={data.contributeSection.imageWidth}
          imgHeight={data.contributeSection.imageHeight}
          buttons={data.contributeSection.buttons}
        />
      </div>
    </div>
  );
};

export { FrontpageLayout };
export type { FrontpageData };
