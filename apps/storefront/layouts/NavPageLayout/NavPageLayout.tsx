import type * as React from 'react';

import { Container, ImageSection, MdxContent } from '../../components';
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
    <main
      id='main'
      className='greyBackground'
    >
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
        <Container>
          <MdxContent>{content}</MdxContent>
        </Container>
      </div>
    </main>
  );
};

export { NavPageLayout };
export type { NavPageLayoutData };
