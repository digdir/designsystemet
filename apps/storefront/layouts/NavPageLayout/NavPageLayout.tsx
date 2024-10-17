import { Container } from '@repo/components';
import type * as React from 'react';

import { MdxContent } from '../../components';
import {
  Banner,
  BannerHeading,
  BannerIcon,
  BannerIngress,
} from '../../components/Banner/Banner';

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
  headerColor?: 'red' | 'blue';
}

const NavPageLayout = ({ content, data, banner }: NavPageLayoutProps) => {
  return (
    <main id='main' className='greyBackground'>
      {banner && (
        <Banner color={banner.color}>
          <BannerIcon>{banner.icon}</BannerIcon>
          <BannerHeading>{banner.title}</BannerHeading>
          {banner.ingress && <BannerIngress>{banner.ingress}</BannerIngress>}
        </Banner>
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
