import React, { useState } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';

import { CodeSnippet } from '../CodeSnippet/CodeSnippet';

import classes from './Preview.module.css';

interface PreviewProps {
  component: any;
  args: any;
}

const Preview = ({ component, args }: PreviewProps) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <div>
      <div className={classes.preview}>
        {React.cloneElement(React.createElement(component), args)}
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
          <CodeSnippet language='javascript'>
            {reactElementToJSXString(
              React.cloneElement(React.createElement(component), args),
            )}
          </CodeSnippet>
        )}
      </div>
    </div>
  );
};

export default Preview;
