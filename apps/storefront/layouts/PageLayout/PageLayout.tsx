import { Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Container } from '@repo/components';
import NextLink from 'next/link';
import type * as React from 'react';

import { MdxContent } from '../../components';

import classes from './PageLayout.module.css';

interface PageLayoutProps {
  content: React.ReactNode;
  data: PageLayoutData;
}

type PageLayoutData = {
  title: string;
  date: string;
  author: string;
  backText: string;
  backUrl: string;
};

const PageLayout = ({ content, data }: PageLayoutProps) => {
  return (
    <main id='main'>
      <div className={classes.header}>
        <Container>
          <div className={classes.headerContent}>
            <Link asChild className={classes.backBtn} color='neutral'>
              <NextLink href={'/' + data.backUrl} prefetch={false}>
                <ArrowLeftIcon title='Tilbake' fontSize={28} />
                {data.backText}
              </NextLink>
            </Link>
            <Paragraph size='lg' variant='short' asChild>
              <div className={classes.meta}>
                <span>{data.author && <span>{data.author}</span>}</span>
                <span className={classes.separator}> - </span>
                <span>{data.date && <div>{data.date}</div>}</span>
              </div>
            </Paragraph>
            <Heading level={1} size='lg' className={classes.title}>
              {data.title}
            </Heading>
          </div>
        </Container>
      </div>
      <Container className={classes.container}>
        <div className={classes.content}>
          <MdxContent>{content}</MdxContent>
        </div>
      </Container>
    </main>
  );
};

export { PageLayout };
