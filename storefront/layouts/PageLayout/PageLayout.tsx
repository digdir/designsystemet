import React from 'react';
import { useRouter } from 'next/router';

import { Container } from '../../components/Container/Container';
import { SidebarMenu } from '../../components/SidebarMenu/SidebarMenu';
import {
  convertQueryToReadable,
  capitalizeString,
} from '../../utils/StringHelpers';
import type { PageMenuDataType } from '../../utils/menus/PageMenu';

import { MdxContent } from '../../components/MdxContent/MdxContent';

import classes from './PageLayout.module.css';

interface PageLayoutProps {
  content: React.ReactNode;
  menu: PageMenuDataType;
  data: PageLayoutData;
}

type PageLayoutData = {
  title: string;
  date: string;
  showMenu: boolean;
};

const PageLayout = ({ content, menu, data }: PageLayoutProps) => {
  const router = useRouter();

  return (
    <div>
      <Container className={classes.page}>
        <div className={classes.left}>
          <SidebarMenu
            title={capitalizeString(convertQueryToReadable(menu.title))}
            menu={menu}
            activeRouterPath={router.pathname}
          />
        </div>
        <div className={classes.right}>
          <div className={classes.header}>
            <h1 className={classes.title}>{data.title}</h1>
            {data.date && <div className={classes.date}>{data.date}</div>}
          </div>

          <div className={classes.content}>
            <MdxContent>{content}</MdxContent>
          </div>
        </div>
      </Container>
    </div>
  );
};

export { PageLayout };
