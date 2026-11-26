import { Alert, Paragraph } from '@digdir/designsystemet-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { formatDate } from '~/_utils/date';
import { findRedirect, REDIRECT_PARAM } from '~/_utils/redirects';
import classes from './redirect-banner.module.css';

type Notice = {
  from: string;
  expires: string;
  pathname: string;
};

/**
 * Tells visitors that arrived through an old (redirected) URL to update their link.
 * Pages are prerendered, so this can only be known on the client.
 */
export function RedirectBanner({ lang }: { lang: string }) {
  const { t } = useTranslation();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const from = params.get(REDIRECT_PARAM);
    setNotice((current) => (current?.pathname === pathname ? current : null));
    if (!from) return;

    /* Only trust the param if it matches a redirect we know leads to this page */
    const match = findRedirect(from);
    if (match?.to.split('#')[0] === pathname) {
      setNotice({ from: match.from, expires: match.expires, pathname });
    }

    /* Remove the param, so the address bar shows the link we want people to use */
    params.delete(REDIRECT_PARAM);
    navigate(
      { search: params.toString(), hash },
      { replace: true, preventScrollReset: true },
    );
  }, [pathname, search, hash, navigate]);

  return (
    <div role='status' aria-live='polite'>
      {notice?.pathname === pathname && (
        <Alert data-color='info' data-size='sm' className={classes.banner}>
          <Paragraph>
            {t('redirect-banner.message', {
              from: notice.from,
              date: formatDate(notice.expires, lang),
              /* React already escapes, and i18next would turn "/" into "&#x2F;" */
              interpolation: { escapeValue: false },
            })}
          </Paragraph>
        </Alert>
      )}
    </div>
  );
}
