import * as ds from '@digdir/designsystemet-react';
import { useSynchronizedAnimation } from '@digdir/designsystemet-react';
import * as aksel from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { prettify } from 'htmlfy';
import { themes } from 'prism-react-renderer';
import {
  type ComponentType,
  createElement,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { renderToString } from 'react-dom/server';
import { useTranslation } from 'react-i18next';
import {
  LiveEditor,
  LiveError,
  LivePreview,
  LiveProvider,
  withLive,
} from 'react-live';
import { useLocation } from 'react-router';
import classes from './live-component.module.css';

const SyncedBox = () => {
  const ref = useSynchronizedAnimation<HTMLDivElement>('spin');

  return (
    <div
      ref={ref}
      style={{
        animation: 'spin 2s linear infinite',

        width: '30px',
        height: '30px',
        backgroundColor: 'red',
      }}
    />
  );
};

const scopes = {
  ...ds,
  ...aksel,
  useState,
  useEffect,
  useRef,
  useId,
  SyncedBox,
};

export type LiveComponentProps = {
  story: string;
  layout?: 'row' | 'column' | 'centered' | 'block';
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
  html: string;
  id?: string;
  hidden?: boolean;
};

const Editor = ({ live, html, id, hidden }: EditorProps) => {
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const activateEditorRef = useRef<HTMLDivElement>(null);
  const [resetCount, setResetCount] = useState(0);
  const [showHTML, setShowHTML] = useState(false);
  const [copied, setCopied] = useState('');
  // Truncate SVGs to <svg></svg> to reduce noise
  const truncatedHtml = (html || 'Unable to parse html').replace(
    /<svg[^>]*>[\s\S]*?<\/svg>/gi,
    '<svg></svg>',
  );
  const rawHtml = prettify(truncatedHtml, {
    tag_wrap: 63,
    content_wrap: 70,
  });

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
    setTimeout(() => {
      const editor = wrapperRef.current?.querySelector(
        '.live-editor',
      ) as HTMLElement | null;
      editor?.animate(
        [
          {
            offset: 0.01,
            backgroundColor:
              'color-mix(in oklab, var(--ds-color-neutral-background-default), yellow 50%)',
          },
        ],
        {
          duration: 900,
          easing: 'ease',
          fill: 'forwards',
        },
      );
    }, 0);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        showHTML ? rawHtml : live.newCode ? live.newCode : live.code,
      );
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
    <section
      className={classes.editorOuterWrapper}
      id={id}
      aria-label={t('live-component.show-code')}
      hidden={hidden}
    >
      <ds.Paragraph className={classes.language}>
        {showHTML ? 'HTML' : 'React'}
      </ds.Paragraph>
      <ds.ToggleGroup
        variant='secondary'
        data-size='sm'
        value={showHTML.toString()}
        onChange={(v) => setShowHTML(v === 'true')}
        data-color='neutral'
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
        {t('live-component.reset')}
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
        {t('live-component.copy')}
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
          tabIndex={showHTML ? -1 : 0}
        >
          {t('live-component.activateA')}{' '}
          <kbd>{t('live-component.activateB')}</kbd>{' '}
          {t('live-component.activateC')}
        </div>
        <LiveEditor
          className={cl(classes.editor, !showHTML && classes.hidden)}
          disabled
          code={rawHtml}
          language='html'
        />
        <LiveEditor
          key={resetCount}
          onChange={live.onChange}
          className={cl(
            classes.editor,
            classes['live-editor'],
            'live-editor',
            showHTML && classes.hidden,
          )}
        />
      </div>
    </section>
  );
};
const EditorWithLive = withLive(Editor) as ComponentType<{
  html: string;
  id?: string;
  hidden?: boolean;
}>;

/**
 * Hidden component that captures the SSR HTML using renderToString.
 * This gives us the HTML that React produces before hydration,
 * rather than the DOM after client-side rendering.
 */
type HtmlCaptureProps = {
  live: ContextValue;
  onHtmlCapture: (html: string) => void;
};

const HtmlCapture = ({ live, onHtmlCapture }: HtmlCaptureProps) => {
  const Element = live.element;

  useEffect(() => {
    if (Element) {
      try {
        const html = renderToString(createElement(Element));
        onHtmlCapture(html);
      } catch {
        onHtmlCapture('Unable to render HTML');
      }
    }
  }, [Element, onHtmlCapture]);

  return null;
};

const HtmlCaptureWithLive = withLive(HtmlCapture) as ComponentType<{
  onHtmlCapture: (html: string) => void;
}>;

export const LiveComponent = ({
  story,
  layout = 'centered',
}: LiveComponentProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [showEditor, setShowEditor] = useState(false);
  const [colorScheme, setColorScheme] = useState<string | null>('dark');
  const [invertedColorScheme, setInvertedColorScheme] = useState<string | null>(
    'light',
  );
  const [useInverted, setUseInverted] = useState(false);
  const [html, setHtml] = useState<string>('');
  const previewColorScheme = useInverted ? invertedColorScheme : colorScheme;
  const editorId = useId();

  useEffect(() => {
    // Set initial color scheme and inverted color scheme
    const initialColorScheme =
      document?.documentElement?.getAttribute('data-color-scheme');
    setColorScheme(initialColorScheme);
    if (initialColorScheme === 'dark') {
      setInvertedColorScheme('light');
    } else {
      setInvertedColorScheme('dark');
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const currentColorScheme = (
          mutation.target as HTMLElement
        ).getAttribute('data-color-scheme');
        setColorScheme(currentColorScheme);
        if (currentColorScheme === 'dark') {
          setInvertedColorScheme('light');
        } else {
          setInvertedColorScheme('dark');
        }
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
  }, [location]);

  return (
    <LiveProvider
      code={story}
      scope={scopes}
      noInline
      theme={colorScheme === 'dark' ? themes.vsDark : themes.vsLight}
    >
      {/* Hidden component that captures SSR HTML using renderToString */}
      <HtmlCaptureWithLive onHtmlCapture={setHtml} />
      <div
        className={cl(classes.preview, 'u-long-content')}
        data-color='accent'
        data-live='true'
        data-layout={layout}
      >
        <LivePreview
          data-color-scheme={previewColorScheme}
          className={classes['live-preview']}
        />
        <LiveError className={cl('ds-alert', classes['live-preview-error'])} />
        <ds.Button
          data-color='neutral'
          data-size='sm'
          variant='tertiary'
          icon
          onClick={() => setUseInverted((v) => !v)}
          aria-pressed={useInverted}
          className={classes.themeToggle}
          aria-label={t('live-component.invert-color-scheme')}
        >
          {previewColorScheme === 'dark' ? (
            <aksel.SunIcon aria-hidden />
          ) : (
            <aksel.MoonIcon aria-hidden />
          )}
        </ds.Button>
        <ds.Button
          data-color='neutral'
          data-size='sm'
          variant='tertiary'
          onClick={() => setShowEditor((v) => !v)}
          aria-expanded={showEditor}
          className={classes.codeButton}
          aria-controls={editorId}
        >
          <aksel.ChevronDownIcon aria-hidden />
          {showEditor
            ? t('live-component.hide-code')
            : t('live-component.show-code')}
        </ds.Button>
      </div>
      <EditorWithLive id={editorId} html={html} hidden={!showEditor} />
    </LiveProvider>
  );
};
