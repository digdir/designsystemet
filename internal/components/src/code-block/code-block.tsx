import { Button, Skeleton, Tooltip } from '@digdir/designsystemet-react';
import { ClipboardCheckmarkIcon, FilesIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { Suspense, use, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './code-block.module.css';
import { observeCodeVisibility, scheduleCodeHighlight } from './highlight';
import { isPrettifySupported, prettifyCode } from './prettify';

export type CodeBlockProps = {
  children: string;
  className?: string;
  /**
   * Language for syntax highlighting.
   * Uses Microlighter's bundled grammars. Unsupported languages remain plain text.
   */
  language?:
    | 'markup'
    | 'jsx'
    | 'tsx'
    | 'swift'
    | 'kotlin'
    | 'objectivec'
    | 'js-extras'
    | 'reason'
    | 'rust'
    | 'graphql'
    | 'yaml'
    | 'go'
    | 'cpp'
    | 'markdown'
    | 'python'
    | 'json'
    | 'text'
    | 'bash'
    | string;
  /**
   * Formats the code with Prettier before showing it, for languages Prettier supports.
   * Turn it off for code that is already formatted, e.g. generated files, so it shows straight away.
   *
   * @default true
   */
  prettify?: boolean;
};

/* This component uses "use" when prettifying, so it needs to be wrapped in Suspense */
const CodeBlockContent = ({
  children,
  className,
  language = 'text',
  prettify = true,
}: CodeBlockProps) => {
  const shouldPrettify = prettify && isPrettifySupported(language);

  // Initial prettify promise for Suspense (only runs once on mount). Without prettifying there is
  // nothing to wait for, so the code shows straight away instead of the Suspense fallback.
  const prettifyPromise = useMemo(
    () => (shouldPrettify ? prettifyCode(children, language) : null),
    [],
  );

  const initialText = prettifyPromise ? use(prettifyPromise) : children;

  const [text, setText] = useState(initialText);
  const [wrap, setWrap] = useState(true);

  useEffect(() => {
    if (shouldPrettify) {
      prettifyCode(children, language).then((pretty) => {
        setText(pretty);
      });
    } else {
      setText(children);
    }
  }, [children, language, shouldPrettify]);

  return (
    <div className={classes.codeBlockWrapper}>
      <div className={classes.toolbar}>
        <WrapButton wrap={wrap} onToggle={() => setWrap(!wrap)} />
        <CopyButton text={text} />
      </div>
      <HighlightedCode
        className={cl(classes.codeBlock, !wrap && classes.noWrap, className)}
        language={language}
      >
        {text}
      </HighlightedCode>
    </div>
  );
};

export const CodeBlock = ({
  children,
  className,
  language = 'text',
  prettify = true,
}: CodeBlockProps) => {
  return (
    <Suspense fallback={<Skeleton height={120} />}>
      <CodeBlockContent
        className={className}
        language={language}
        prettify={prettify}
      >
        {children}
      </CodeBlockContent>
    </Suspense>
  );
};

/** Read-only syntax highlighting without formatting or toolbar controls. */
export const HighlightedCode = ({
  children,
  language = 'text',
  className,
  hidden,
}: Pick<CodeBlockProps, 'children' | 'language' | 'className'> & {
  hidden?: boolean;
}) => {
  useEffect(observeCodeVisibility, []);

  useEffect(() => {
    if (hidden) return;
    scheduleCodeHighlight();
    return scheduleCodeHighlight;
  }, [children, language, hidden]);

  return (
    <pre
      className={cl(classes.highlightedCode, className)}
      data-code-block
      data-language={language}
      data-syntax-theme='github'
      hidden={hidden}
    >
      <code data-language={language}>{children}</code>
    </pre>
  );
};

const WrapButton = ({
  wrap,
  onToggle,
}: {
  wrap: boolean;
  onToggle: () => void;
}) => {
  const { t } = useTranslation();
  const label = wrap
    ? t('code-block.disable-wrap', 'Disable line wrapping')
    : t('code-block.enable-wrap', 'Enable line wrapping');

  return (
    <Tooltip content={label} placement='top'>
      <Button
        aria-label={label}
        onClick={onToggle}
        className={classes.wrapButton}
        data-color='neutral'
        data-size='sm'
        variant='tertiary'
        icon
      >
        {/* I could not find this in aksel icons, so I ripped it from their website */}
        <svg
          width='1.5em'
          height='1.5em'
          viewBox='0 0 32 32'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          aria-hidden='true'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M20.0303 20.0303C20.3232 19.7374 20.3232 19.2626 20.0303 18.9697C19.7374 18.6768 19.2626 18.6768 18.9697 18.9697L16.4697 21.4697C16.1768 21.7626 16.1768 22.2374 16.4697 22.5303L18.9697 25.0303C19.2626 25.3232 19.7374 25.3232 20.0303 25.0303C20.3232 24.7374 20.3232 24.2626 20.0303 23.9697L18.8107 22.75L22 22.75C24.0711 22.75 25.75 21.0711 25.75 19C25.75 16.9289 24.0711 15.25 22 15.25L7 15.25C6.58578 15.25 6.25 15.5858 6.25 16C6.25 16.4142 6.58578 16.75 7 16.75L22 16.75C23.2426 16.75 24.25 17.7574 24.25 19C24.25 20.2426 23.2426 21.25 22 21.25L18.8107 21.25L20.0303 20.0303ZM7 9.25C6.58579 9.25 6.25 9.58579 6.25 10C6.25 10.4142 6.58579 10.75 7 10.75L25 10.75C25.4142 10.75 25.75 10.4142 25.75 10C25.75 9.58579 25.4142 9.25 25 9.25L7 9.25ZM7 21.25C6.58578 21.25 6.25 21.5858 6.25 22C6.25 22.4142 6.58578 22.75 7 22.75L14 22.75C14.4142 22.75 14.75 22.4142 14.75 22C14.75 21.5858 14.4142 21.25 14 21.25L7 21.25Z'
            fill='currentColor'
          ></path>
        </svg>
      </Button>
    </Tooltip>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState('');

  const onButtonClick = async () => {
    setCopied('');
    await navigator.clipboard.writeText(text);
    setCopied(classes.copied);
  };
  return (
    <>
      <Button
        onMouseLeave={() => setCopied('')}
        onClick={() => onButtonClick()}
        className={classes.copyButton}
        data-color='neutral'
        data-size='sm'
        variant='tertiary'
      >
        <span className={cl(classes.stack, copied)}>
          <FilesIcon aria-hidden />
          <ClipboardCheckmarkIcon aria-hidden />
        </span>
        {t('clipboard-button.copy', 'Copy')}
      </Button>
      <span role='status' className='ds-sr-only'>
        {copied ? t('clipboard-button.copied', 'Copied') : ''}
      </span>
    </>
  );
};
