import { Button } from '@digdir/designsystemet-react';
import { ChevronDownIcon, MoonIcon, SunIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import { CodePanel, type Language } from './code-panel';
import { HtmlCapture } from './html-capture';
import classes from './live-component.module.css';
import { liveScope } from './scope';
import { useColorScheme } from './use-color-scheme';

export type LiveComponentProps = {
  story: string;
  /** `story` rendered to HTML */
  html: string;
  layout?: 'row' | 'column' | 'centered' | 'block';
  language?: Language;
  defaultOpen?: boolean;
  startAsInert?: boolean /*to prevent focus on load of error-summary stories*/;
  truncateSvg?: boolean;
};

/** A story shown as a preview, with its code in a panel that can be opened underneath. */
export const LiveComponent = ({
  story,
  html,
  layout = 'centered',
  language = 'react',
  defaultOpen = false,
  startAsInert,
  truncateSvg,
}: LiveComponentProps) => {
  const { t } = useTranslation();
  const [showEditor, setShowEditor] = useState(defaultOpen);
  const [useInverted, setUseInverted] = useState(false);
  const [editedHtml, setEditedHtml] = useState<string>();
  const colorScheme = useColorScheme();
  const invertedColorScheme = colorScheme === 'dark' ? 'light' : 'dark';
  const previewColorScheme = useInverted ? invertedColorScheme : colorScheme;
  const editorId = useId();

  return (
    <LiveProvider code={story} scope={liveScope} noInline>
      <HtmlCapture onHtmlCapture={setEditedHtml} />
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
        {/* Always present, so an error in edited code is announced when it appears */}
        <div role='status' className={classes['live-preview-status']}>
          <LiveError
            className={cl('ds-alert', classes['live-preview-error'])}
          />
        </div>
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
          {/* aria-expanded says whether it is open, so the text stays the same */}
          {t('live-component.show-code')}
        </Button>
      </div>
      <CodePanel
        id={editorId}
        html={editedHtml ?? html}
        hidden={!showEditor}
        language={language}
        truncateSvg={truncateSvg}
      />
    </LiveProvider>
  );
};
