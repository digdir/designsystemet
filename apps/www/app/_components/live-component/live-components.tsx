import * as ds from '@digdir/designsystemet-react';
import * as aksel from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { prettify } from 'htmlfy';
import { themes } from 'prism-react-renderer';
import {
  type ComponentType,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
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

//@TODO: i18n
const Editor = ({ live, html }: EditorProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const activateEditorRef = useRef<HTMLDivElement>(null);
  const [resetCount, setResetCount] = useState(0);
  const [showHTML, setShowHTML] = useState(false);
  const [copied, setCopied] = useState('');
  const rawHtml = prettify(
    html?.innerHTML.toString() || 'Unable to parse html',
    {
      tag_wrap: 63,
      content_wrap: 70,
    },
  );

  const setupEditorTabIndex = () => {
    const preEl = wrapperRef.current?.querySelector(
      '.live-editor > pre',
    ) as HTMLElement | null;
    if (preEl) {
      preEl.tabIndex = -1;
    }
  };

  useEffect(() => {
    setupEditorTabIndex();
  }, []);

  useEffect(() => {
    setupEditorTabIndex();
  }, [resetCount]);

  const reset = () => {
    live.onChange(live.code);
    setResetCount(resetCount + 1);
    activateEditorRef.current?.focus();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(showHTML ? rawHtml : live.code);
      setCopied(classes.copied);
    } catch (error) {
      throw Error(String(error));
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      return;
    }

    if (event.key === 'Escape') {
      activateEditorRef.current?.focus();
      return;
    }

    if (event.key === 'Enter') {
      if (document.activeElement?.nodeName === 'BUTTON') {
        return;
      }
      const preEl = wrapperRef.current?.querySelector(
        '.live-editor > pre',
      ) as HTMLElement | null;
      if (preEl !== document.activeElement) {
        event.preventDefault();
        event.stopPropagation();
        preEl?.focus();
      }
    }
  };

  return (
    <div className={classes.editorOuterWrapper}>
      <ds.Paragraph className={classes.language}>
        {showHTML ? 'HTML' : 'React'}
      </ds.Paragraph>
      <ds.ToggleGroup
        data-size='sm'
        value={showHTML.toString()}
        onChange={(v) => setShowHTML(v === 'true')}
      >
        <ds.ToggleGroup.Item value='false'>React</ds.ToggleGroup.Item>
        <ds.ToggleGroup.Item value='true'>HTML</ds.ToggleGroup.Item>
      </ds.ToggleGroup>
      <ds.Button
        data-color='neutral'
        variant='tertiary'
        className={classes.action}
        onClick={reset}
        data-size='sm'
        /* disabled={live.code === live.newCode} */
        type='button'
      >
        <aksel.ArrowsCirclepathIcon />
        Reset
      </ds.Button>
      <ds.Button
        data-color='neutral'
        variant='tertiary'
        className={cl(classes.copy, classes.action)}
        onClick={copy}
        onMouseOver={() => setCopied('')}
        data-size='sm'
        type='button'
      >
        <span className={cl(classes.stack, copied)}>
          <aksel.FilesIcon aria-hidden />
          <aksel.ClipboardCheckmarkIcon aria-hidden />
        </span>
        Copy
      </ds.Button>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: <need to manage keyboard events from here> */}
      <div
        ref={wrapperRef}
        className={classes.editorWrapper}
        onKeyDown={handleKeyDown}
      >
        <div
          className={cl(classes['activate-editor'], 'ds-focus--visible')}
          ref={activateEditorRef}
          aria-live='polite'
          tabIndex={0}
        >
          Press <kbd>Enter</kbd> to start editing
        </div>
        {showHTML ? (
          <LiveEditor
            className={classes.editor}
            disabled
            code={rawHtml}
            language='html'
          />
        ) : (
          <LiveEditor
            key={resetCount}
            onChange={live.onChange}
            className={cl(classes.editor, classes['live-editor'])}
          />
        )}
      </div>
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
        <LivePreview className={classes['live-preview']} ref={setHtml} />
        <ds.Button
          data-color='neutral'
          data-size='sm'
          variant='tertiary'
          onClick={() => setShowEditor((v) => !v)}
          aria-pressed={showEditor}
          className={classes.codeButton}
        >
          <aksel.ChevronDownIcon />
          {showEditor ? 'Hide code' : 'Show code'}
        </ds.Button>
        <LiveError className='ds-alert' />
      </div>
      {showEditor ? <EditorWithLive html={html} /> : null}
    </LiveProvider>
  );
};
