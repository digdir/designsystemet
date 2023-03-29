import React from 'react';
import { ImageIcon } from '@navikt/aksel-icons';

import { Container } from '../../components/Container/Container';
import Section from '../../components/Section/Section';
import { NavigationCard } from '../../components/NavigationCard/NavigationCard';

import classes from './SubjectsLayout.module.css';

interface SubjectsLayoutProps {
  content: React.ReactNode;
  data: SubjectsLayoutData;
}

interface SubjectsLayoutData {
  title: string;
  description: string;
  items: [];
}

interface SubjectsLayoutItem {
  title: string;
  color: 'red' | 'blue' | 'yellow';
  description: string;
  icon: React.ReactNode;
  url: string;
}

const SubjectsLayout = ({ content, data }: SubjectsLayoutProps) => {
  return (
    <div>
      <style>{`
        body {
          background: #f4f5f6;
        }
      `}</style>

      <div className={classes.element}></div>
      <div className='max-width-container main'>
        <Container>
          <div className={classes.box}>
            <h1 className={classes.title}>{data.title}</h1>
            <p className={classes.desc}>{data.description}</p>
          </div>
        </Container>
        <div>
          {content}
          <Section>
            {data.items.map((item: SubjectsLayoutItem, index: number) => (
              <NavigationCard
                url={item.url}
                title={item.title}
                color={item.color}
                icon={item.icon}
                description={item.description}
                key={index}
              />
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
};

export { SubjectsLayout };
export type { SubjectsLayoutData };
