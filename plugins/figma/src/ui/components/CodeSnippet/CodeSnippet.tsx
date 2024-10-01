import { Tooltip } from '@digdir/designsystemet-react';
import { FilesIcon } from '@navikt/aksel-icons';
import * as prettierEstree from 'prettier/plugins/estree';
import * as prettierHtml from 'prettier/plugins/html.js';
import * as prettierMarkdown from 'prettier/plugins/markdown.js';
import * as prettierCSS from 'prettier/plugins/postcss.js';
import * as prettierTypescript from 'prettier/plugins/typescript.js';
import { format } from 'prettier/standalone.js';
import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import classes from './CodeSnippet.module.css';

const plugins = [
  prettierTypescript,
  prettierEstree,
  prettierCSS,
  prettierMarkdown,
  prettierHtml,
];

type CodeSnippetProps = {
  language?: 'css' | 'html' | 'ts' | 'markdown' | 'js';
  children?: string;
};

export const CodeSnippet = ({
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
        const formatted = await format(children, { parser: language, plugins });
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
    <div className={classes.codeSnippet}>
      {snippet && (
        <>
          <div className={classes.copyContainer}>
            <Tooltip
              content={toolTipText}
              className={classes.tooltip}
              portal={false}
              placement='top'
            >
              <button
                onMouseEnter={() => setToolTipText('Kopier')}
                onClick={() => onButtonClick()}
                className={classes.icon}
              >
                <FilesIcon fontSize={22} />
              </button>
            </Tooltip>
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language={language}
            customStyle={{
              fontSize: '13px',
              margin: 0,
              padding: '15px',
            }}
          >
            {snippet}
          </SyntaxHighlighter>
        </>
      )}
    </div>
  );
};
