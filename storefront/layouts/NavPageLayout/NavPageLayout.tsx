import React from 'react';

import { Container } from '../../components/Container/Container';
import Section from '../../components/Section/Section';
import { NavigationCard } from '../../components/NavigationCard/NavigationCard';
import { ImageSection } from '../../components/ImageSection/ImageSection';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import classes from './NavPageLayout.module.css';

interface NavPageLayoutProps {
  content: React.ReactNode;
  data: NavPageLayoutData;
}

interface NavPageLayoutData {
  sections: [];
  headerColor?: 'red' | 'blue';
}

interface NavPageLayoutItem {
  title: string;
  color: 'red' | 'blue' | 'yellow';
  description: string;
  icon: React.ReactNode;
  url: string;
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
        src='/img/people-table.svg'
        color='blue'
        imgHeight={220}
        imgWidth={220}
        title='God praksis'
        description='Her deler vi god praksis med hverandre. Råd og veiledning som kan bidra til å lage bedre helhetlige tjenester samles her. Har du forslag til artikler eller innsikt til denne siden?'
        link={{
          text: 'Ta kontakt med oss på e-post',
          prefix: <EnvelopeClosedIcon fontSize={26} />,
          href: '#',
        }}
      ></ImageSection>
      <div className={classes.content}>
        <Container>{content}</Container>
      </div>
    </div>
  );
};

export { NavPageLayout };
export type { NavPageLayoutData };
