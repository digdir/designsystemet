import React from 'react';

import { Container, ImageSection } from '../../components';
import type { ImageSectionProps } from '../../components';

import classes from './NavPageLayout.module.css';

interface NavPageLayoutProps {
  content: React.ReactNode;
  data: NavPageLayoutData;
}

interface NavPageLayoutData {
  imageSection: ImageSectionProps;
  headerColor?: 'red' | 'blue';
}

const NavPageLayout = ({ content, data }: NavPageLayoutProps) => {
  return (
    <div>
      <style>{`
        body {
          background: #f4f5f6;
        }
      `}</style>
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
      <div className={classes.content}>
        <Container>{content}</Container>
      </div>
    </div>
  );
};

export { NavPageLayout };
export type { NavPageLayoutData };
