import React from 'react';
import Head from 'next/head';

interface MetaProps {
  title: string;
  description: string;
}

const Meta = ({ title, description }: MetaProps) => {
  title = `${title} - Felles Designsystem`;
  return (
    <Head>
      <title>{title}</title>
      <meta
        name='description'
        content={description}
      />
      <meta charSet='utf-8' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1'
      />
      <link
        rel='shortcut icon'
        href='/favicon.ico'
      />
    </Head>
  );
};

// let's set a default title
Meta.defaultProps = {
  title: 'Felles Designsystem',
};

export { Meta };
