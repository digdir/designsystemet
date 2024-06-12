import { useEffect, useState } from 'react';
import { FilesIcon } from '@navikt/aksel-icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { format } from 'prettier/standalone.js';
import * as prettierMarkdown from 'prettier/plugins/markdown.js';
import * as prettierHtml from 'prettier/plugins/html.js';
import * as prettierCSS from 'prettier/plugins/postcss.js';
import * as prettierTypescript from 'prettier/plugins/typescript.js';
import * as prettierEstree from 'prettier/plugins/estree';
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Button, Tooltip } from '@digdir/designsystemet-react';

import classes from './CodeSnippet.module.css';

const plugins = [
  prettierTypescript,
  prettierEstree,
  prettierCSS,
  prettierMarkdown,
  prettierHtml,
];

type CodeSnippetProps = {
  language?: 'css' | 'html' | 'ts' | 'markdown';
  children?: string;
};

const CodeSnippet = ({
  language = 'markdown',
  children = '',
}: CodeSnippetProps) => {
  const [toolTipText, setToolTipText] = useState('Kopier');
  const [snippet, setSnippet] = useState('');

  useEffect(() => {
    async function formatSnippet(
      children: string,
      language: CodeSnippetProps['language'],
    ) {
      try {
        const formatted = await format(children, {
          parser: language === 'ts' ? 'typescript' : language,
          plugins,
        });
        setSnippet(formatted);
      } catch (error) {
        console.error('Failed formatting code snippet:', error);
      }
    }
    void formatSnippet(children, language);

    return () => {
      setSnippet('');
    };
  }, [children, language]);

  const onButtonClick = () => {
    setToolTipText('Kopiert!');
    navigator.clipboard.writeText(children).catch((reason) => {
      throw Error(String(reason));
    });
  };

  return (
    <div
      className={classes.codeSnippet}
      data-ds-color-mode='dark'
    >
      {snippet && (
        <>
          <Tooltip content={toolTipText}>
            <Button
              onMouseEnter={() => setToolTipText('Kopier')}
              onClick={() => onButtonClick()}
              className={classes.icon}
              title='Kopier'
              icon
              color='neutral'
              size='sm'
            >
              <FilesIcon fontSize='1.5rem' />
            </Button>
          </Tooltip>
          <SyntaxHighlighter
            style={nightOwl}
            language='jsx'
            customStyle={{
              fontSize: '15px',
              margin: 0,
              padding: '18px',
            }}
          >
            {snippet}
          </SyntaxHighlighter>
        </>
      )}
    </div>
  );
};

export { CodeSnippet };
