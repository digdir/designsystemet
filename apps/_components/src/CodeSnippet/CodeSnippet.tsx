'use client';

import { Button, Tooltip } from '@digdir/designsystemet-react';
import { FilesIcon } from '@navikt/aksel-icons';
import * as prettierBabel from 'prettier/parser-babel';
import * as prettierEstree from 'prettier/plugins/estree';
import * as prettierHtml from 'prettier/plugins/html.js';
import * as prettierMarkdown from 'prettier/plugins/markdown.js';
import * as prettierCSS from 'prettier/plugins/postcss.js';
import * as prettierTypescript from 'prettier/plugins/typescript.js';
import { format } from 'prettier/standalone.js';
import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';

import classes from './CodeSnippet.module.css';

import cl from 'clsx/lite';

const plugins = [
  prettierTypescript,
  prettierEstree,
  prettierCSS,
  prettierMarkdown,
  prettierHtml,
  prettierBabel,
];

type CodeSnippetProps = {
  language?: 'css' | 'html' | 'ts' | 'markdown' | 'js' | 'json' | 'sh';
  children?: string;
  className?: string;
};

const CodeSnippet = ({
  language = 'markdown',
  children = '',
  className,
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
        setSnippet(children);
      }
    }
    void formatSnippet(children, language);

    return () => {
      setSnippet(children);
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
      className={cl(classes.codeSnippet, className)}
      data-ds-color-mode='dark'
    >
      {snippet && (
        <>
          <Tooltip content={toolTipText}>
            <Button
              onMouseEnter={() => setToolTipText('Kopier')}
              onClick={() => onButtonClick()}
              className={classes.copyButton}
              aria-label='Kopier'
              icon
              color='neutral'
              size='sm'
            >
              <FilesIcon fontSize='1.5rem' />
            </Button>
          </Tooltip>
          <SyntaxHighlighter
            style={nightOwl}
            language={language}
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
