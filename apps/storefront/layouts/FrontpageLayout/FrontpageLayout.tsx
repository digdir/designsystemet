import type * as React from 'react';

type FrontpageLayoutProps = {
  content: React.ReactNode;
};

const FrontpageLayout = ({ content }: FrontpageLayoutProps) => {
  return <main id='main'>{content}</main>;
};

export { FrontpageLayout };
