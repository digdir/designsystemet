import { Button, ToggleGroup } from '@digdir/designsystemet-react';
import { HighlightedCode } from '@internal/components';
import {
  ArrowsCirclepathIcon,
  ChevronDownIcon,
  ClipboardCheckmarkIcon,
  FilesIcon,
  MoonIcon,
  SunIcon,
} from '@navikt/aksel-icons';
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
import { liveScope, loadAllIcons } from './scope';

/* vsLight's attr-name color (rgb(255, 0, 0)) is only 4:1 against white, below the 4.5:1 required for normal text. */
const accessibleVsLight: typeof themes.vsLight = {
  ...themes.vsLight,
  // Appended (not merged into the base entry) so it only ever affects 'attr-name'.
  styles: [
    ...themes.vsLight.styles,
    { types: ['attr-name'], style: { color: '#b81a1a' } },
  ],
};

type Language = 'react' | 'html';

export type LiveComponentProps = {
  story: string;
  /** `story` rendered to HTML */
  html: string;
  layout?: 'row' | 'column' | 'centered' | 'block' | 'page';
  language?: Language;
  defaultOpen?: boolean;
  startAsInert?: boolean /*to prevent focus on load of error-summary stories*/;
  truncateSvg?: boolean;
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
  language?: Language;
  truncateSvg?: boolean;
};

const Editor = ({
  live,
  html,
  id,
  hidden,
  language,
  truncateSvg = true,
}: EditorProps) => {
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const activateEditorRef = useRef<HTMLDivElement>(null);
  const [resetCount, setResetCount] = useState(0);
  const [showHTML, setShowHTML] = useState(language === 'html');
  const [copied, setCopied] = useState('');
  const latestCode = useRef(live.code);

  const onChange = (code: string) => {
    latestCode.current = code;
    // The story as written only needs the icons that are already loaded
    if (code === live.code) return live.onChange(code);
    // Edited code may use any icon. Run whatever is newest once they have loaded.
    loadAllIcons().then(() => live.onChange(latestCode.current));
  };

  // Truncate SVGs to <svg></svg> to reduce noise, preserving aria-* and class attributes
  const truncatedHtml = truncateSvg
    ? (html || 'Unable to parse html').replace(
        /<svg[^>]*>[\s\S]*?<\/svg>/gi,
        (match) => {
          const ariaAttrs = match.match(/aria-[\w-]+="[^"]*"/gi) || [];
          const dataAttrs = match.match(/data-[\w-]+="[^"]*"/gi) || [];
          const classAttr = match.match(/class="[^"]*"/i) || [];
          const roleAttr = match.match(/role="[^"]*"/i) || [];
          const attrs = [...classAttr, ...ariaAttrs, ...roleAttr, ...dataAttrs];
          return `<svg${attrs.length ? ` ${attrs.join(' ')}` : ''}></svg>`;
        },
      )
    : html || 'Unable to parse html';
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
    onChange(live.code);
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
    if (showHTML || event.key === 'Tab') {
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
      <ToggleGroup
        className={classes.language}
        variant='secondary'
        aria-label={t('live-component.language')}
        data-size='sm'
        value={showHTML.toString()}
        onChange={(v) => setShowHTML(v === 'true')}
        data-color='neutral'
      >
        <ToggleGroup.Item value='true'>HTML</ToggleGroup.Item>
        <ToggleGroup.Item value='false'>React</ToggleGroup.Item>
      </ToggleGroup>
      <Button
        data-color='neutral'
        variant='tertiary'
        className={classes.action}
        onClick={reset}
        data-size='sm'
        hidden={live.newCode === undefined || live.newCode === live.code}
        type='button'
      >
        <ArrowsCirclepathIcon />
        <span className={classes.resetText}>{t('live-component.reset')}</span>
      </Button>
      <Button
        data-color='neutral'
        variant='tertiary'
        className={cl(classes.copy, classes.action)}
        onClick={copy}
        onMouseOver={() => setCopied('')}
        data-size='sm'
        type='button'
      >
        <span className={cl(classes.stack, copied)}>
          <FilesIcon aria-hidden />
          <ClipboardCheckmarkIcon aria-hidden />
        </span>
        <span>{t('live-component.copy')}</span>
      </Button>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: <need to manage keyboard events from here> */}
      <div
        ref={wrapperRef}
        className={classes.editorWrapper}
        onKeyDown={handleKeyDown}
        onFocus={(event) => {
          // About to edit: fetch the icons now so the first keystroke doesn't wait for them
          if ((event.target as HTMLElement).closest('.live-editor')) {
            loadAllIcons();
          }
        }}
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
        <HighlightedCode
          className={classes.htmlEditor}
          hidden={hidden || !showHTML}
          language='html'
        >
          {rawHtml}
        </HighlightedCode>
        <LiveEditor
          key={resetCount}
          onChange={onChange}
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
  language?: Language;
  truncateSvg?: boolean;
}>;

/**
 * Hidden component that captures the HTML of edited code using renderToString.
 * This gives us the HTML that React produces before hydration,
 * rather than the DOM after client-side rendering.
 */
type HtmlCaptureProps = {
  live: ContextValue;
  onHtmlCapture: (html: string | undefined) => void;
};

const HtmlCapture = ({ live, onHtmlCapture }: HtmlCaptureProps) => {
  const Element = live.element;
  const isEdited = live.newCode !== undefined && live.newCode !== live.code;

  useEffect(() => {
    // The loader has already rendered the story as it was written
    if (!isEdited) return onHtmlCapture(undefined);
    if (!Element) return;

    let isCurrent = true;
    // Only needed once someone edits, so it isn't part of what every page loads
    import('react-dom/server').then(({ renderToString }) => {
      if (!isCurrent) return;
      try {
        onHtmlCapture(renderToString(createElement(Element)));
      } catch {
        onHtmlCapture('Unable to render HTML');
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [Element, isEdited, onHtmlCapture]);

  return null;
};

const HtmlCaptureWithLive = withLive(HtmlCapture) as ComponentType<{
  onHtmlCapture: (html: string | undefined) => void;
}>;

export const LiveComponent = ({
  story,
  html,
  layout = 'centered',
  language = 'react',
  defaultOpen = false,
  startAsInert,
  truncateSvg,
}: LiveComponentProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [showEditor, setShowEditor] = useState(defaultOpen);
  const [colorScheme, setColorScheme] = useState<string | null>('dark');
  const [invertedColorScheme, setInvertedColorScheme] = useState<string | null>(
    'light',
  );
  const [useInverted, setUseInverted] = useState(false);
  const [editedHtml, setEditedHtml] = useState<string>();
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
      scope={liveScope}
      noInline
      theme={colorScheme === 'dark' ? themes.vsDark : accessibleVsLight}
    >
      {/* Hidden component that captures the HTML of edited code */}
      <HtmlCaptureWithLive onHtmlCapture={setEditedHtml} />
      <div
        className={cl(classes.preview, 'u-long-content')}
        data-color='accent'
        data-live='true'
        data-layout={layout}
      >
        <LivePreview
          inert={startAsInert}
          data-color-scheme={previewColorScheme}
          className={classes['live-preview']}
          ref={(el: HTMLDivElement | null) => {
            if (el && startAsInert)
              /*500 has been tested to work in firefox & chrome*/
              setTimeout(() => el?.removeAttribute('inert'), 500);
          }}
        />
        <LiveError className={cl('ds-alert', classes['live-preview-error'])} />
        <Button
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
            <SunIcon aria-hidden />
          ) : (
            <MoonIcon aria-hidden />
          )}
        </Button>
        <Button
          data-color='neutral'
          data-size='sm'
          variant='tertiary'
          onClick={() => setShowEditor((v) => !v)}
          aria-expanded={showEditor}
          className={classes.codeButton}
          aria-controls={editorId}
        >
          <ChevronDownIcon aria-hidden />
          {showEditor
            ? t('live-component.hide-code')
            : t('live-component.show-code')}
        </Button>
      </div>
      <EditorWithLive
        id={editorId}
        html={editedHtml ?? html}
        hidden={!showEditor}
        language={language}
        truncateSvg={truncateSvg}
      />
    </LiveProvider>
  );
};
