import Head from 'next/head';

interface MetaProps {
  title: string;
  description: string;
  image?: string;
}

const Meta = ({ title, description, image }: MetaProps) => {
  title = `${title} - Designsystemet`;
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

      {/* images */}
      <meta
        property='og:image'
        content={image ? image : '/img/designsystemet-meta.png'}
      />
      <meta
        property='twitter:image'
        content={image ? image : '/img/designsystemet-meta.png'}
      />
    </Head>
  );
};

// Let's set a default title
Meta.defaultProps = {
  title: 'Designsystemet',
};

export { Meta };
