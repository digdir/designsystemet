import React, { useState, Children, useEffect, useCallback } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';

import { CodeSnippet } from '../CodeSnippet/CodeSnippet';

import classes from './Preview.module.css';

interface PreviewProps {
  children: React.ReactNode;
  backgroundColor?: 'light' | 'dark';
}

interface PreviewItemProps {
  component: any;
  args: any;
}

const PreviewItem = ({ component, args }: PreviewItemProps) => {
  return <>{React.cloneElement(React.createElement(component), args)}</>;
};

const Preview = ({ children, backgroundColor = 'light' }: PreviewProps) => {
  const [showCode, setShowCode] = useState(false);

  const getString = useCallback(() => {
    let s = '';

    if (React.Children.toArray(children).length > 1) {
      s += '<>';
    }

    React.Children.forEach(children, (element) => {
      if (!React.isValidElement(element)) return;

      const { component, args } = element.props;
      const jsx = reactElementToJSXString(
        React.cloneElement(React.createElement(component), args),
      );
      s += jsx;
    });

    if (React.Children.toArray(children).length > 1) {
      s += '</>';
    }

    return s;
  }, [children]);

  useEffect(() => {
    getString();
  }, [getString]);

  return (
    <div className={classes[backgroundColor]}>
      <div className={classes.preview}>
        <div className={classes.items}>
          {Children.toArray(children).map((item: any, index: number) => (
            <div
              className={classes.item}
              key={index}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <button
          className={classes.button}
          onClick={() => {
            setShowCode(!showCode);
          }}
        >
          {showCode ? 'Skjul kode' : 'Vis kode'}
        </button>
      </div>
      <div className={classes.code}>
        {showCode && (
          <CodeSnippet language='javascript'>{getString()}</CodeSnippet>
        )}
      </div>
    </div>
  );
};

export { Preview, PreviewItem };
