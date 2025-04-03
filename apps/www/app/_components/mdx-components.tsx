import * as DS from '@digdir/designsystemet-react';
import type { ParagraphProps } from '@digdir/designsystemet-react';
import { getMDXComponent } from 'mdx-bundler/dist/client';
import { type JSX, useMemo } from 'react';
import { Link } from 'react-router';
import { Contributors } from '~/_components/contributors/contributors';
import { Image } from '~/_components/image/image';
import { CodeBlock } from './code-block/code-block';
import { ResponsiveIframe } from './responsive-iframe/responsive-iframe';

const defaultComponents = {
  ...DS,
  Image,
  ResponsiveIframe,
  Contributors,
  p: (props: ParagraphProps) => <DS.Paragraph {...props} />,
  a: ({ href, ...props }: JSX.IntrinsicElements['a']) => (
    <DS.Link {...props} asChild>
      <Link to={href || ''}>{props.children}</Link>
    </DS.Link>
  ),
  pre: ({
    children: {
      props: { children = '', className = '' },
    },
  }) => {
    return (
      <CodeBlock language={className.replace('language-', '')}>
        {children}
      </CodeBlock>
    );
  },
};

export const MDXComponents = ({
  components,
  code,
}: {
  components?: {
    [key: string]: JSX.Element;
  };
  code?: string;
}) => {
  const Component = useMemo(() => {
    if (!code) return null;
    return getMDXComponent(code);
  }, [code]);

  return (
    <>
      {Component ? (
        <Component
          /* @ts-ignore TODO fix type error */
          components={{
            ...defaultComponents,
            ...components,
          }}
        />
      ) : (
        'Kunne ikkje laste innhold'
      )}
    </>
  );
};
