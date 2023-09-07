import React from 'react';

import { Section, NavigationCard, ImageSection } from '../../components';
import type { NavigationCardProps, ImageSectionProps } from '../../components';

type FrontpageLayoutProps = {
  Content: React.ReactNode;
  data: FrontpageData;
};

type FrontpageData = {
  title: string;
  description: string;
  navigationCards: {
    title: string;
    description: string;
    items: [];
  };
  contributeSection: ImageSectionProps;
};

const FrontpageLayout = ({ Content, data }: FrontpageLayoutProps) => {
  return (
    <main id='main'>
      {Content}

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
    </main>
  );
};

export { FrontpageLayout };
export type { FrontpageData };
