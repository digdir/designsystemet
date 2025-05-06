'use client';
import { Button } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useState } from 'react';
import { CodeBlock as ReactCodeBlock } from 'react-code-block';
import classes from './code-block.module.css';

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

export const CodeBlock = ({
  children,
  className,
  language = 'text',
}: CodeBlockProps) => {
  return (
    <ReactCodeBlock code={children} language={language}>
      <div className={classes.codeBlockWrapper}>
        <ReactCodeBlock.Code
          data-color-scheme='dark'
          className={cl(classes.codeBlock, className)}
        >
          <ReactCodeBlock.LineContent>
            <ReactCodeBlock.Token />
          </ReactCodeBlock.LineContent>
        </ReactCodeBlock.Code>
        <div data-color-scheme='dark' className={classes.toolbar}>
          <CopyButton text={children} />
        </div>
      </div>
    </ReactCodeBlock>
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
        onMouseEnter={() => setToolTipText('Kopier')}
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
