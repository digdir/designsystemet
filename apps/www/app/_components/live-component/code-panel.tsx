import { Button, ToggleGroup } from '@digdir/designsystemet-react';
import { HighlightedCode } from '@internal/components';
import {
  ArrowsCirclepathIcon,
  ClipboardCheckmarkIcon,
  FilesIcon,
} from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LiveContext } from 'react-live';
import { CodeEditor } from './code-editor';
import { formatHtml } from './format-html';
import classes from './live-component.module.css';
import { loadAllIcons } from './scope';

export type Language = 'react' | 'html';

/** How long to wait after the last keystroke before running edited code, in milliseconds. */
const RUN_DELAY = 250;

type CodePanelProps = {
  /** The HTML the code currently renders to */
  html: string;
  id?: string;
  hidden?: boolean;
  /** The tab to start on */
  language?: Language;
  truncateSvg?: boolean;
};

/**
 * The code of a story: its HTML, and its React source which can be edited to change the preview.
 * Must be inside the `LiveProvider` that renders the preview.
 */
export const CodePanel = ({
  html,
  id,
  hidden,
  language,
  truncateSvg = true,
}: CodePanelProps) => {
  const { t } = useTranslation();
  const live = useContext(LiveContext);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);
  const [showHTML, setShowHTML] = useState(language === 'html');
  const [copied, setCopied] = useState(false);
  const [story, setStory] = useState(live.code);
  const [code, setCode] = useState(live.code);
  const latestCode = useRef(live.code);
  const pendingRun = useRef<ReturnType<typeof setTimeout>>(undefined);
  const formattedHtml = formatHtml(html, truncateSvg);

  // A new story replaces whatever was typed into the previous one
  if (story !== live.code) {
    setStory(live.code);
    setCode(live.code);
  }

  const onChange = (code: string) => {
    setCode(code);
    latestCode.current = code;
    clearTimeout(pendingRun.current);
    pendingRun.current = undefined;
    // The story as written only needs the icons that are already loaded
    if (code === live.code) return live.onChange(code);
    // Only the latest edit may run after both the typing pause and icon loading.
    const run = setTimeout(() => {
      loadAllIcons().then(() => {
        if (pendingRun.current !== run) return;
        pendingRun.current = undefined;
        live.onChange(latestCode.current);
      });
    }, RUN_DELAY);
    pendingRun.current = run;
  };

  // An edit that is still waiting must not run against the next story, or after we are gone
  useEffect(() => {
    latestCode.current = live.code;
    return () => {
      clearTimeout(pendingRun.current);
      pendingRun.current = undefined;
    };
  }, [live.code]);

  const reset = () => {
    onChange(live.code);
    // The reset button hides once there is nothing to reset, so focus has to go somewhere else
    (showHTML ? copyRef : editorRef).current?.focus();
  };

  const copy = async () => {
    // Cleared first, so that copying a second time is announced again
    setCopied(false);
    try {
      await navigator.clipboard.writeText(showHTML ? formattedHtml : code);
      setCopied(true);
    } catch (error) {
      throw Error(String(error));
    }
  };

  return (
    <section
      className={classes.editorOuterWrapper}
      id={id}
      aria-label={t('live-component.code')}
      data-color='neutral'
      hidden={hidden}
    >
      <ToggleGroup
        className={classes.language}
        variant='secondary'
        aria-label={t('live-component.language')}
        data-size='sm'
        value={showHTML.toString()}
        onChange={(v) => setShowHTML(v === 'true')}
      >
        <ToggleGroup.Item value='true'>HTML</ToggleGroup.Item>
        <ToggleGroup.Item value='false'>React</ToggleGroup.Item>
      </ToggleGroup>
      <Button
        variant='tertiary'
        className={classes.action}
        onClick={reset}
        data-size='sm'
        hidden={code === live.code}
        type='button'
        // The text is hidden on narrow screens, where only the icon is left
        aria-label={t('live-component.reset')}
      >
        <ArrowsCirclepathIcon />
        <span className={classes.actionText}>{t('live-component.reset')}</span>
      </Button>
      <Button
        variant='tertiary'
        className={cl(classes.copy, classes.action)}
        ref={copyRef}
        onClick={copy}
        onMouseOver={() => setCopied(false)}
        onBlur={() => setCopied(false)}
        aria-label={t('live-component.copy')}
        data-size='sm'
        type='button'
      >
        <span className={cl(classes.stack, copied && classes.copied)}>
          <FilesIcon aria-hidden />
          <ClipboardCheckmarkIcon aria-hidden />
        </span>
        <span className={classes.actionText}>{t('live-component.copy')}</span>
      </Button>
      {/* Tells screen reader users what the changing icon tells everyone else */}
      <span className='ds-sr-only' role='status'>
        {copied && t('live-component.copied')}
      </span>
      <HighlightedCode
        className={cl(classes.editor, classes.code)}
        hidden={hidden || !showHTML}
        language='html'
      >
        {formattedHtml}
      </HighlightedCode>
      <CodeEditor
        ref={editorRef}
        value={code}
        onChange={onChange}
        label={t('live-component.edit-code')}
        language='tsx'
        hidden={hidden || showHTML}
        // About to edit: fetch the icons now so the first keystroke doesn't wait for them
        onFocus={loadAllIcons}
      />
    </section>
  );
};
