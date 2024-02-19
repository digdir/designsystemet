import type * as React from 'react';

import { Banner } from 'components/SubPages/Banner/Banner';

import { Container, ImageSection, MdxContent } from '../../components';
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
          <Banner.Icon>{banner.icon}</Banner.Icon>
          <Banner.Heading>{banner.title}</Banner.Heading>
          {banner.ingress && <Banner.Ingress>{banner.ingress}</Banner.Ingress>}
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
