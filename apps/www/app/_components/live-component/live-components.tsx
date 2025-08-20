import * as ds from '@digdir/designsystemet-react';
import * as aksel from '@navikt/aksel-icons';
import { themes } from 'prism-react-renderer';
import { useState } from 'react';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';
import classes from './live-component.module.css';

const scopes = {
  ...ds,
  ...aksel,
};

type LiveComponentProps = {
  code: string;
};

export const LiveComponent = ({ code }: LiveComponentProps) => {
  const [showEditor, setShowEditor] = useState(false);
  return (
    <LiveProvider code={code} scope={scopes} noInline theme={themes.vsDark}>
      <div className={classes.preview} data-color='accent'>
        <LivePreview />
        <ds.Button
          data-color='neutral'
          data-size='sm'
          variant='tertiary'
          onClick={() => setShowEditor((v) => !v)}
          aria-pressed={showEditor}
          className={classes.codeButton}
        >
          {showEditor ? 'Hide code' : 'Show code'}
        </ds.Button>
        <LiveError className='ds-alert' />
      </div>
      {showEditor ? <LiveEditor className={classes.editor} /> : null}
    </LiveProvider>
  );
};
