import * as ds from '@digdir/designsystemet-react';
import * as aksel from '@navikt/aksel-icons';
import { themes } from 'prism-react-renderer';
import { type ComponentType, useState } from 'react';
import {
  LiveEditor,
  LiveError,
  LivePreview,
  LiveProvider,
  withLive,
} from 'react-live';
import classes from './live-component.module.css';

const scopes = {
  ...ds,
  ...aksel,
};

type LiveComponentProps = {
  code: string;
};

//copied from https://github.com/FormidableLabs/react-live/blob/master/packages/react-live/src/components/Live/LiveContext.ts
type ContextValue = {
  error?: string;
  element?: ComponentType | null;
  code: string;
  newCode?: string;
  disabled: boolean;
  theme?: typeof themes.nightOwl;
  language: string;
  onError(error: Error): void;
  onChange(value: string): void;
};

const Editor = ({ live }: { live: ContextValue }) => {
  console.log(live);
  const [resetCount, setResetCount] = useState(0);

  const reset = () => {
    live.onChange(live.code);
    setResetCount(resetCount + 1);
  };

  return (
    <div data-color-scheme='dark' className={classes.editorWrapper}>
      <ds.Button
        data-color='neutral'
        variant='secondary'
        className={classes.reset}
        onClick={reset}
      >
        Reset
      </ds.Button>
      <LiveEditor
        key={resetCount}
        onChange={live.onChange}
        className={classes.editor}
      />
    </div>
  );
};
const EditorWithLive = withLive(Editor) as ComponentType;

export const LiveComponent = ({ code }: LiveComponentProps) => {
  const [showEditor, setShowEditor] = useState(false);
  return (
    <LiveProvider code={code} scope={scopes} noInline theme={themes.vsDark}>
      <div className={classes.preview} data-color='accent' data-live='true'>
        <LivePreview />
        <ds.Button
          data-color='neutral'
          data-size='sm'
          variant='tertiary'
          onClick={() => setShowEditor((v) => !v)}
          aria-pressed={showEditor}
          className={classes.codeButton}
        >
          {showEditor ? 'Hide code' : 'Edit code'}
        </ds.Button>
        <LiveError className='ds-alert' />
      </div>
      {showEditor ? <EditorWithLive /> : null}
    </LiveProvider>
  );
};
