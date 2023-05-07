import React from 'react';

import { Container } from '../../components/Container/Container';
import Section from '../../components/Section/Section';
import { NavigationCard } from '../../components/NavigationCard/NavigationCard';
import { ImageSection } from '../../components/ImageSection/ImageSection';

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

      <div className={classes.content}>{content}</div>
    </div>
  );
};

export { NavPageLayout };
export type { NavPageLayoutData };
