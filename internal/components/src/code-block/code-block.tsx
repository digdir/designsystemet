import { Button, Skeleton } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { Suspense, use, useMemo, useState } from 'react';
import { CodeBlock as ReactCodeBlock } from 'react-code-block';
import classes from './code-block.module.css';
import { isPrettifySupported, prettifyCode } from './prettify';

export type CodeBlockProps = {
  children: string;
  className?: string;
  /**
   * Language for syntax highlighting.
   * Only some languages give syntax highlighting, if the passed language is not supported
   * it will default to 'text'.
   *
   * @todo Extend the language list with prismjs.
   */
  language?:
    | 'markup'
    | 'jsx'
    | 'tsx'
    | 'swift'
    | 'kotlin'
    | 'objectivec'
    | 'js-extras'
    | 'reason'
    | 'rust'
    | 'graphql'
    | 'yaml'
    | 'go'
    | 'cpp'
    | 'markdown'
    | 'python'
    | 'json'
    | 'text'
    | 'bash'
    | string;
};

/* This component uses "use", it needs to be wrapped in Suspense */
const CodeBlockContent = ({
  children,
  className,
  language = 'text',
}: CodeBlockProps) => {
  const prettifyPromise = useMemo(() => {
    if (isPrettifySupported(language)) {
      return prettifyCode(children, language);
    }
    return Promise.resolve(children);
  }, [children, language]);

  const prettyCode = use(prettifyPromise);

  return (
    <ReactCodeBlock code={prettyCode} language={language}>
      <div className={classes.codeBlockWrapper}>
        <ReactCodeBlock.Code
          data-color-scheme='dark'
          className={cl(classes.codeBlock, className)}
        >
          <code>
            <ReactCodeBlock.LineContent>
              <ReactCodeBlock.Token />
            </ReactCodeBlock.LineContent>
          </code>
        </ReactCodeBlock.Code>
        <div data-color-scheme='dark' className={classes.toolbar}>
          <CopyButton text={prettyCode} />
        </div>
      </div>
    </ReactCodeBlock>
  );
};

export const CodeBlock = ({
  children,
  className,
  language = 'text',
}: CodeBlockProps) => {
  return (
    <Suspense fallback={<Skeleton height={120} />}>
      <CodeBlockContent className={className} language={language}>
        {children}
      </CodeBlockContent>
    </Suspense>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const [toolTipText, setToolTipText] = useState('Kopier');

  const onButtonClick = () => {
    setToolTipText('Kopiert!');
    navigator.clipboard.writeText(text).catch((reason) => {
      throw Error(String(reason));
    });
  };
  return (
    <>
      {/* @ts-ignore */}
      <Button
        onMouseLeave={() => setToolTipText('Kopier')}
        onClick={() => onButtonClick()}
        className={classes.copyButton}
        aria-label='Kopier kodesnutt'
        data-color='neutral'
        data-size='2xs'
      >
        {toolTipText}
      </Button>
    </>
  );
};
