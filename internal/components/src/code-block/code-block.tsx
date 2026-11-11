import { Button, Skeleton } from '@digdir/designsystemet-react';
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
        <CopyButton text={text} />
      </div>
      <HighlightedCode
        className={cl(classes.codeBlock, className)}
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
