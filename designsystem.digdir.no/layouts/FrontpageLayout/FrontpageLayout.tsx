import React from 'react';
import { Col, Row } from 'react-bootstrap';

import Header from '../../components/Header/Header';
import Section from '../../components/Section/Section';
import NavigationCard from '../../components/NavigationCard/NavigationCard';
import Banner from '../../components/Banner/Banner';

interface FrontpageLayoutProps {
  Content: React.ReactNode;
  data: any;
}

interface FrontpageData {
  title: string;
  description: string;
  navigationCards: {
    title: string;
    items: any[];
  };
}

const FrontpageLayout = ({ Content, data }: FrontpageLayoutProps) => {
  return (
    <div>
      <Header />
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

        <Section backgroundColor='white'>
          <h3>Vil du bidra?</h3>
          <p>
            Vi ønsker at dette skal bli et felles hjem for gjenbrukbare
            komponenter, god praksis, interaksjonsmønstre, brukerdialog, innsikt
            og mer. Målet er at innbyggere skal oppleve offentlige tjenester mer
            helhetlig, ved at vi bygger tjenestene våre på det samme fundamentet
            og med de samme retningslinjene.
          </p>
          <p>
            Vil du høre mer om dette, eller samarbeide med oss? Ta kontakt med
            oss på e-post.
          </p>
        </Section>

        <Section
          backgroundColor='grey'
          title='Siste oppdateringer'
        >
          <Row className='gy-4'>news</Row>
        </Section>
      </div>
    </div>
  );
};

export { FrontpageLayout };
export type { FrontpageData };
