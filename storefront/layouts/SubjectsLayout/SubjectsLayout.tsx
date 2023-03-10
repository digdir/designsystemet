import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Picture } from '@navikt/ds-icons';

import Header from '../../components/Header/Header';
import Section from '../../components/Section/Section';
import { NavigationCard } from '../../components/NavigationCard/NavigationCard';

import classes from './SubjectsLayout.module.css';

interface SubjectsLayoutProps {
  Content: React.ReactNode;
  data: any;
}

interface SubjectsLayoutData {
  title: string;
  description: string;
  items: any[];
}

const SubjectsLayout = ({ Content, data }: SubjectsLayoutProps) => {
  return (
    <div>
      <style>{`
        body {
          background: #f4f5f6;
        }
      `}</style>
      <Header />
      <div className={classes.element}></div>
      <div className='max-width-container main'>
        <Container>
          <Row className=''>
            <Col md={6}>
              <div className={classes.box}>
                <h1 className={classes.title}>{data.title}</h1>
                <p className={classes.desc}>{data.description}</p>
              </div>
            </Col>
          </Row>
        </Container>
        <div>
          {Content}
          <Section>
            <Row className='gy-4'>
              {data.items.map((item: any, index: number) => (
                <Col
                  key={index}
                  md={4}
                >
                  <NavigationCard
                    url={item.url}
                    title={item.title}
                    color={item.color}
                    icon={<Picture fontSize={28} />}
                    description={item.description}
                  />
                </Col>
              ))}
            </Row>
          </Section>
        </div>
      </div>
    </div>
  );
};

export { SubjectsLayout };
export type { SubjectsLayoutData };
