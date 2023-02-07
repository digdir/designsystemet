import classes from './Section.module.css';
import { Container } from 'react-bootstrap';
import React from 'react';
import cn from 'classnames';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  backgroundColor?: 'white' | 'grey';
}

const Section = ({
  children,
  title,
  backgroundColor = 'grey',
}: SectionProps) => {
  return (
    <div className={cn(classes.section, classes[backgroundColor])}>
      <Container>
        {title && <h2 className={classes.title}>{title}</h2>}
        <div className={classes.content}>{children}</div>
      </Container>
    </div>
  );
};

export default Section;
