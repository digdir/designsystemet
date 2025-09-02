import * as ds from '@digdir/designsystemet-react';
import * as aksel from '@navikt/aksel-icons';
import { prettify } from 'htmlfy';
import { themes } from 'prism-react-renderer';
import { type ComponentType, useEffect, useState } from 'react';
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
  theme?: typeof themes.vsDark;
  language: string;
  onError(error: Error): void;
  onChange(value: string): void;
};

type EditorProps = {
  live: ContextValue;
  html: HTMLElement | null;
};

const Editor = ({ live, html }: EditorProps) => {
  const [resetCount, setResetCount] = useState(0);
  const rawHtml = prettify(html?.innerHTML.toString() || '', {
    tag_wrap: 63,
    content_wrap: 70,
  });

  const reset = () => {
    live.onChange(live.code);
    setResetCount(resetCount + 1);
  };

  return (
    <div className={classes.editorWrapper}>
      <ds.Button
        data-color='neutral'
        variant='secondary'
        className={classes.reset}
        onClick={reset}
        data-size='sm'
        disabled={live.code === live.newCode}
      >
        Reset
      </ds.Button>
      <LiveEditor
        key={resetCount}
        onChange={live.onChange}
        className={classes.editor}
      />
      <p>Output html:</p>
      <LiveEditor
        className={classes.editor}
        disabled
        code={rawHtml}
        language='html'
      />
    </div>
  );
};
const EditorWithLive = withLive(Editor) as ComponentType<{
  html: HTMLElement | null;
}>;

export const LiveComponent = ({ code }: LiveComponentProps) => {
  const [showEditor, setShowEditor] = useState(false);
  const [colorScheme, setColorScheme] = useState<string | null>('dark');
  const [html, setHtml] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Set initial color scheme
    setColorScheme(
      document?.documentElement?.getAttribute('data-color-scheme'),
    );

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        console.log(mutation);
        setColorScheme(
          (mutation.target as HTMLElement).getAttribute('data-color-scheme'),
        );
      });
    });

    // Observe document.documentElement for data-color-scheme changes
    if (document?.documentElement) {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-color-scheme'],
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <LiveProvider
      code={code}
      scope={scopes}
      noInline
      theme={colorScheme === 'dark' ? themes.vsDark : themes.vsLight}
    >
      <div className={classes.preview} data-color='accent' data-live='true'>
        <LivePreview ref={setHtml} />
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
      {showEditor ? <EditorWithLive html={html} /> : null}
    </LiveProvider>
  );
};
