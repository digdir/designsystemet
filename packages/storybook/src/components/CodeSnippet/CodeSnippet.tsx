import React from 'react';
import { Copy } from 'lucide-react';
import classes from './CodeSnippet.module.css';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
// Import more language support here as needed e.g.:
// import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
SyntaxHighlighter.registerLanguage('markup', markup);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('javascript', javascript);
// Formatting
import prettier from 'prettier/standalone.js';
import parserJs from 'prettier/parser-flow.js';
import parserHtml from 'prettier/parser-html.js';
import parserCss from 'prettier/parser-postcss.js';

const CodeSnippet = ({ language = 'markup', children = '' }) => {
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
    });
  }
  if (language === 'markup') {
    // eslint-disable-next-line import/no-named-as-default-member
    children = prettier.format(children, {
      parser: 'html',
      plugins: [parserHtml],
    });
  }

  return (
    <div className={classes['code-snippet']}>
      <button className={classes['code-snippet__icon']}>
        <Copy size={20} />
      </button>
      <SyntaxHighlighter
        language={language}
        style={prism}
        customStyle={{
          fontSize: '14px',
          margin: 0,
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export { CodeSnippet };
