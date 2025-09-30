import * as ds from '@digdir/designsystemet-react';
import * as aksel from '@navikt/aksel-icons';
import type { HTMLAttributes, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import classes from './do-dont.module.css';

const scopes = {
  ...ds,
  ...aksel,
};

type doDontProps = {
  code: string;
  variant: 'do' | 'dont';
  children?: ReactNode;
  layout?: 'row' | 'column' | 'centered';
} & HTMLAttributes<HTMLDivElement>;

export const DoDont = ({
  code,
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
            <aksel.CheckmarkCircleFillIcon />
            <p className='ds-paragraph'>{t('do')}</p>
          </>
        ) : (
          <>
            <aksel.XMarkOctagonFillIcon />
            <p className='ds-paragraph'>{t('dont')}</p>
          </>
        )}
      </div>
      <LiveProvider code={code} scope={scopes} noInline disabled>
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
