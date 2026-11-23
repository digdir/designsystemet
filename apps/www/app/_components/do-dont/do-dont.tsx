import {
  CheckmarkCircleFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import type { HTMLAttributes, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import { liveScope } from '../live-component/scope';
import classes from './do-dont.module.css';

type doDontProps = {
  code: string;
  /** `code` rendered to HTML */
  html: string;
  variant: 'do' | 'dont';
  children?: ReactNode;
  layout?: 'row' | 'column' | 'centered';
} & HTMLAttributes<HTMLDivElement>;

export const DoDont = ({
  code,
  html,
  variant,
  layout = 'row',
  children,
  ...rest
}: doDontProps) => {
  const { t } = useTranslation();
  return (
    <div
      className={classes.dodont}
      data-variant={variant}
      data-layout={layout}
      {...rest}
    >
      <div
        className={classes.header}
        data-color={variant === 'do' ? 'success' : 'danger'}
      >
        {variant === 'do' ? (
          <>
            <CheckmarkCircleFillIcon aria-hidden='true' />
            <p className='ds-paragraph'>{t('do')}</p>
          </>
        ) : (
          <>
            <XMarkOctagonFillIcon aria-hidden='true' />
            <p className='ds-paragraph'>{t('dont')}</p>
          </>
        )}
      </div>
      <div data-documentation-code-block hidden>
        <pre>
          <code className='language-tsx'>{code}</code>
        </pre>
      </div>
      <div data-documentation-code-block hidden>
        <pre>
          <code className='language-html'>{html}</code>
        </pre>
      </div>
      <LiveProvider code={code} scope={liveScope} noInline disabled>
        <div className={classes.preview}>
          <LivePreview
            className={classes['live-preview']}
            data-layout={layout}
          />
          <LiveError className='ds-alert' />
        </div>
      </LiveProvider>
      <div className={classes.footer}>{children}</div>
    </div>
  );
};
