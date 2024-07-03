import type * as React from 'react';
import { Container } from '@digdir/components';

import {
  Banner,
  BannerHeading,
  BannerIcon,
  BannerIngress,
} from '../../components/Banner/Banner';
import { ImageSection, MdxContent } from '../../components';
import type { ImageSectionProps } from '../../components';

import classes from './NavPageLayout.module.css';

interface NavPageLayoutProps {
  content: React.ReactNode;
  data?: NavPageLayoutData;
  banner?: {
    color: 'blue' | 'red' | 'yellow';
    title: string;
    ingress?: string;
    icon: React.ReactNode;
  };
}

interface NavPageLayoutData {
  imageSection: ImageSectionProps;
  headerColor?: 'red' | 'blue';
}

const NavPageLayout = ({ content, data, banner }: NavPageLayoutProps) => {
  return (
    <main
      id='main'
      className='greyBackground'
    >
      {banner && (
        <Banner color={banner.color}>
          <BannerIcon>{banner.icon}</BannerIcon>
          <BannerHeading>{banner.title}</BannerHeading>
          {banner.ingress && <BannerIngress>{banner.ingress}</BannerIngress>}
        </Banner>
      )}
      {data && (
        <ImageSection
          imgSrc={data.imageSection.imgSrc}
          imgAlt={data.imageSection.imgAlt}
          backgroundColor={data.imageSection.backgroundColor}
          imgHeight={220}
          imgWidth={220}
          title={data.imageSection.title}
          description={data.imageSection.description}
          link={data.imageSection.link}
          imgPosition='right'
        ></ImageSection>
      )}
      <div className={classes.content}>
        <Container>
          <MdxContent>{content}</MdxContent>
        </Container>
      </div>
    </main>
  );
};

export { NavPageLayout };
export type { NavPageLayoutData };
