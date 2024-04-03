'use client';

import { useState } from 'react';
import { FilesIcon } from '@navikt/aksel-icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import prettier from 'prettier/standalone.js';
import parserJs from 'prettier/parser-flow.js';
import parserHtml from 'prettier/parser-markdown.js';
import parserCss from 'prettier/parser-postcss.js';
import parserTs from 'prettier/parser-typescript';
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Tooltip } from '@digdir/design-system-react';

import classes from './CodeSnippet.module.css';

const CodeSnippet = ({ language = 'markup', children = '' }) => {
  const [toolTipText, setToolTipText] = useState('Kopier');

  if (language === 'css' || language === 'scss') {
    // eslint-disable-next-line import/no-named-as-default-member
    children = prettier.format(children, {
      parser: 'css',
      plugins: [parserCss],
    });
  }
  if (language === 'javascript') {
    // eslint-disable-next-line import/no-named-as-default-member
    children = prettier.format(children, {
      parser: 'flow',
      plugins: [parserJs],
      tabWidth: 2,
      semi: true,
    });
  }
  if (language === 'markup') {
    // eslint-disable-next-line import/no-named-as-default-member
    children = prettier.format(children, {
      parser: 'markdown',
      plugins: [parserHtml],
    });
  }
  if (language === 'ts') {
    // eslint-disable-next-line import/no-named-as-default-member
    children = prettier.format(children, {
      parser: 'typescript',
      plugins: [parserTs],
    });
  }
  const onButtonClick = () => {
    setToolTipText('Kopiert!');
    navigator.clipboard.writeText(children).catch((reason) => {
      throw Error(String(reason));
    });
  };

  return (
    <div className={classes.codeSnippet}>
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
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export { CodeSnippet };
