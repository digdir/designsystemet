import { useEffect, useState } from 'react';
import { FilesIcon } from '@navikt/aksel-icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import type { Options } from 'prettier';
import prettier from 'prettier/standalone.js';
import parserJs from 'prettier/parser-flow.js';
import parserHtml from 'prettier/parser-markdown.js';
import parserCss from 'prettier/parser-postcss.js';
import parserTs from 'prettier/parser-typescript';
import nightOwl from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Tooltip, Spinner } from '@digdir/designsystemet-react';

import classes from './CodeSnippet.module.css';

const CodeSnippet = ({ language = 'markup', children = '' }) => {
  const [toolTipText, setToolTipText] = useState('Kopier');
  const [snippet, setSnippet] = useState('');

  useEffect(() => {
    async function format(children: string) {
      let options: Options = {
        parser: 'typescript',
        plugins: [parserTs],
      };

      if (language === 'css' || language === 'scss') {
        options = {
          parser: 'css',
          plugins: [parserCss],
        };
      }
      if (language === 'javascript') {
        options = {
          parser: 'flow',
          plugins: [parserJs],
          tabWidth: 2,
          semi: true,
        };
      }
      if (language === 'markup') {
        options = {
          parser: 'markdown',
          plugins: [parserHtml],
        };
      }
      try {
        const formatted = await prettier.format(children, options);
        setSnippet(formatted);
      } catch (error) {
        console.error('Failed formatting code snippet:', {
          children,
          options,
          error,
        });
      }
    }
    format(children);

    return () => {
      setSnippet('');
    };
  }, [children]);
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
