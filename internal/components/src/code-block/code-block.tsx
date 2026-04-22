import { Button, Skeleton } from '@digdir/designsystemet-react';
import { ClipboardCheckmarkIcon, FilesIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { themes } from 'prism-react-renderer';
import { Suspense, use, useEffect, useMemo, useState } from 'react';
import { CodeBlock as ReactCodeBlock } from 'react-code-block';
import { useTranslation } from 'react-i18next';
import classes from './code-block.module.css';
import { isPrettifySupported, prettifyCode } from './prettify';

export type CodeBlockProps = {
  children: string;
  className?: string;
  /**
   * Language for syntax highlighting.
   * Only some languages give syntax highlighting, if the passed language is not supported
   * it will default to 'text'.
   *
   * @todo Extend the language list with prismjs.
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
};

/* This component uses "use", it needs to be wrapped in Suspense */
const CodeBlockContent = ({
  children,
  className,
  language = 'text',
}: CodeBlockProps) => {
  // Initial prettify promise for Suspense (only runs once on mount)
  const prettifyPromise = useMemo(() => {
    if (isPrettifySupported(language)) {
      return prettifyCode(children, language);
    }
    return Promise.resolve(children);
  }, []);

  const initialText = use(prettifyPromise);

  const [text, setText] = useState(initialText);
  const [colorScheme, setColorScheme] = useState<string | null>('dark');

  useEffect(() => {
    if (isPrettifySupported(language)) {
      prettifyCode(children, language).then((pretty) => {
        setText(pretty);
      });
    } else {
      setText(children);
    }
  }, [children, language]);

  useEffect(() => {
    // Set initial color scheme
    setColorScheme(
      document?.documentElement?.getAttribute('data-color-scheme'),
    );

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const currentColorScheme = (
          mutation.target as HTMLElement
        ).getAttribute('data-color-scheme');
        setColorScheme(currentColorScheme);
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
    <ReactCodeBlock
      code={text}
      language={language}
      theme={colorScheme === 'dark' ? themes.vsDark : themes.vsLight}
    >
      <div
        className={classes.codeBlockWrapper}
        data-color-scheme={colorScheme ?? undefined}
      >
        <div className={classes.toolbar}>
          <CopyButton text={text} />
        </div>
        <ReactCodeBlock.Code className={cl(classes.codeBlock, className)}>
          <code>
            <ReactCodeBlock.LineContent>
              <ReactCodeBlock.Token />
            </ReactCodeBlock.LineContent>
          </code>
        </ReactCodeBlock.Code>
      </div>
    </ReactCodeBlock>
  );
};

export const CodeBlock = ({
  children,
  className,
  language = 'text',
}: CodeBlockProps) => {
  return (
    <Suspense fallback={<Skeleton height={120} />}>
      <CodeBlockContent className={className} language={language}>
        {children}
      </CodeBlockContent>
    </Suspense>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState('');

  const onButtonClick = () => {
    setCopied(classes.copied);
    navigator.clipboard.writeText(text).catch((reason) => {
      throw Error(String(reason));
    });
  };
  return (
    <>
      {/* @ts-ignore */}
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
        {t('live-component.copy', 'Copy')}
      </Button>
    </>
  );
};
