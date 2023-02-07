import Head from 'next/head';

interface MetaProps {
  title: string;
}

const Meta = ({ title }: MetaProps) => {
  const t = `${title} | Felles Designsystem`;
  return (
    <Head>
      <title>{t}</title>
      <meta
        name='keywords'
        content='react native, blog, John Doe, tutorial, react navigation'
      />
    </Head>
  );
};

export default Meta;

// let's set a default title
Meta.defaultProps = {
  title: 'Felles Designsystem',
};
