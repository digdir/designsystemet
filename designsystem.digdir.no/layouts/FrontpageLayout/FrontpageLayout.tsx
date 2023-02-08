import Header from '../../components/Header/Header';
import React from 'react';
import Section from '../../components/Section/Section';
import { Col, Row } from 'react-bootstrap';
import NavigationCard from '../../components/NavigationCard/NavigationCard';
import Banner from '../../components/Banner/Banner';

interface FrontpageLayoutProps {
  Content: React.ReactNode;
  data: any;
  articles: string;
}

interface FrontpageData {
  title: string;
  description: string;
  navigationCards: {
    title: string;
    items: any[];
  };
}

const FrontpageLayout = ({ Content, data, articles }: FrontpageLayoutProps) => {
  return (
    <div>
      <Header />
      {articles}
      {Content}
      <div className='max-width-container main'>
        <Banner
          title={data.title}
          desc={data.description}
        />
        <Section title={data.navigationCards.title}>
          <Row className='gy-4'>
            {data.navigationCards.items.map((item: any, index: number) => (
              <Col
                key={index}
                md={4}
              >
                <NavigationCard
                  url={item.url}
                  title={item.title}
                  color={item.color}
                  icon={item.icon}
                />
              </Col>
            ))}
          </Row>
        </Section>
      </div>
    </div>
  );
};

export { FrontpageLayout };
export type { FrontpageData };
