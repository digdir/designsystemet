import { useEffect, useState } from 'react';
import { FilesIcon } from '@navikt/aksel-icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import type { Options } from 'prettier';
import { format } from 'prettier/standalone.js';
import * as prettierMarkdown from 'prettier/plugins/markdown.js';
import * as prettierHtml from 'prettier/plugins/html.js';
import * as prettierCSS from 'prettier/plugins/postcss.js';
import * as prettierTypescript from 'prettier/plugins/typescript.js';
import * as prettierEstree from 'prettier/plugins/estree';
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Tooltip } from '@digdir/designsystemet-react';

import classes from './CodeSnippet.module.css';

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
    async function formatSnippet(children: string) {
      let options: Options = {
        parser: 'typescript',
        plugins: [prettierTypescript, prettierEstree],
      };

      if (language === 'css') {
        options = {
          parser: 'css',
          plugins: [prettierCSS],
        };
      }
      if (language === 'markdown') {
        options = {
          parser: 'markdown',
          plugins: [prettierMarkdown],
        };
      }
      if (language === 'html') {
        options = {
          parser: 'html',
          plugins: [prettierHtml],
        };
      }
      try {
        const formatted = await format(children, options);
        setSnippet(formatted);
      } catch (error) {
        console.error('Failed formatting code snippet:', {
          children,
          options,
          error,
        });
      }
    }
    void formatSnippet(children);

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
    <div className={classes.codeSnippet}>
      {snippet && (
        <>
          <Tooltip content={toolTipText}>
            <button
              onMouseEnter={() => setToolTipText('Kopier')}
              onClick={() => onButtonClick()}
              className={classes.icon}
              title='Kopier'
            >
              <FilesIcon fontSize={20} />
            </button>
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
