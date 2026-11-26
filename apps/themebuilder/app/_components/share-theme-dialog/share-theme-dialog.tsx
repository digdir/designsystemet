import {
  Button,
  Dialog,
  Divider,
  Heading,
  Paragraph,
  Textfield,
  Tooltip,
  ValidationMessage,
} from '@digdir/designsystemet-react';
import { CheckmarkIcon, FilesIcon, LinkIcon } from '@navikt/aksel-icons';
import { type Ref, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import {
  SHARE_THEME_PATH,
  SHARED_THEME_PARAM,
  SHARED_VIEW_PARAM,
  type ShareThemeResult,
} from '~/model/shared-themes';
import { useThemeStore } from '~/model/theme-store';
import classes from './share-theme-dialog.module.css';

type Status =
  | 'idle'
  | 'creating'
  | 'error-generic'
  | 'error-rate-limited'
  | 'error-too-large';

/** What the dialog says about the links: that one was copied or could not be, or that they are the links of a new copy */
type Feedback = 'copied-view' | 'copied-edit' | 'copy-failed' | 'copy-created';

/** How long the dialog says that a link was copied, in ms */
const COPIED_DURATION = 2000;

/**
 * Shares the config as links. Nothing is sent to the server until the user asks for links in the dialog.
 * The server then saves the config, and the theme store saves the edits made from then on.
 * There are two links: one that opens the config for viewing, and one that also lets it be changed.
 * A user on a link can make a copy with new links, to keep working without changing the themes of the first one.
 *
 * The dialog has two states with their own content and buttons, before and after there are links,
 * so that no button turns into another one while it is being pressed.
 */
export const ShareThemeDialog = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const { workspace, sharedId, sharedViewId, markShared } = useThemeStore();
  const headingId = useId();
  const dialogId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const createRef = useRef<HTMLButtonElement>(null);
  const viewLinkRef = useRef<HTMLInputElement>(null);
  const editLinkRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const isCreating = useRef(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  /* Some screen readers do not read a message that is the same as the last one, so every other one gets an invisible space */
  const announcements = useRef(0);
  /* Set when the dialog opens, as the server that renders the page does not know its own address */
  const [origin, setOrigin] = useState('');

  const links =
    sharedId && sharedViewId
      ? {
          view: `${origin}/${lang}?${SHARED_VIEW_PARAM}=${sharedViewId}`,
          edit: `${origin}/${lang}?${SHARED_THEME_PARAM}=${sharedId}`,
        }
      : null;

  const showFeedback = (next: Feedback | null) => {
    clearTimeout(feedbackTimer.current);
    announcements.current++;
    setFeedback(next);
    if (next === 'copied-view' || next === 'copied-edit')
      feedbackTimer.current = setTimeout(
        () => setFeedback(null),
        COPIED_DURATION,
      );
  };
  useEffect(() => () => clearTimeout(feedbackTimer.current), []);

  /* New links get the focus, which also selects the first one: the button that made them is gone or is for making yet another copy */
  const focusNewLinks = useRef(false);
  useEffect(() => {
    if (!sharedId || !focusNewLinks.current) return;
    focusNewLinks.current = false;
    viewLinkRef.current?.focus();
  }, [sharedId]);

  const create = async () => {
    /* A second click while the links are made would make them twice */
    if (isCreating.current) return;
    isCreating.current = true;
    const { config } = workspace;
    const isCopy = sharedId !== null;
    setStatus('creating');
    try {
      const response = await fetch(SHARE_THEME_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });
      const result: ShareThemeResult = await response.json();
      if ('id' in result) {
        focusNewLinks.current = true;
        markShared(result, config);
        setStatus('idle');
        showFeedback(isCopy ? 'copy-created' : null);
      } else if (
        result.error === 'rate-limited' ||
        result.error === 'too-large'
      )
        setStatus(`error-${result.error}`);
      else setStatus('error-generic');
    } catch {
      setStatus('error-generic');
    }
    isCreating.current = false;
  };

  const copy = async (which: 'view' | 'edit') => {
    if (!links) return;
    try {
      await navigator.clipboard.writeText(links[which]);
      showFeedback(`copied-${which}`);
    } catch {
      /* The browser did not allow it. The link is selected instead, so that it can be copied by hand. */
      showFeedback('copy-failed');
      (which === 'view' ? viewLinkRef : editLinkRef).current?.focus();
    }
  };

  const error = status !== 'idle' && status !== 'creating' && (
    <ValidationMessage role='alert'>
      {t(`shareTheme.${status}`)}
    </ValidationMessage>
  );

  return (
    <>
      <Tooltip content={t('shareTheme.share')}>
        <Button
          variant='secondary'
          icon
          data-size='sm'
          aria-label={t('shareTheme.share')}
          onClick={() => {
            setOrigin(window.location.origin);
            if (!isCreating.current) setStatus('idle');
            showFeedback(null);
            dialogRef.current?.showModal();
            /* The dialog opens on what the user came for: the links when there are any, or the button that makes them */
            (viewLinkRef.current ?? createRef.current)?.focus();
          }}
        >
          <LinkIcon aria-hidden />
        </Button>
      </Tooltip>
      <Dialog
        ref={dialogRef}
        closedby='any'
        aria-labelledby={headingId}
        id={dialogId}
      >
        <Dialog.Block>
          <Heading id={headingId} level={2} data-size='sm'>
            {t('shareTheme.share')}
          </Heading>
        </Dialog.Block>
        <Divider style={{ margin: 0 }} />
        {links ? (
          <>
            <Dialog.Block className={classes.content}>
              <Paragraph>{t('shareTheme.linked')}</Paragraph>
              <div className={classes.links}>
                <LinkField
                  ref={viewLinkRef}
                  label={t('shareTheme.view-link')}
                  description={t('shareTheme.view-link-description')}
                  link={links.view}
                  copyLabel={t('shareTheme.copy-view')}
                  isCopied={feedback === 'copied-view'}
                  onCopy={() => copy('view')}
                />
                <LinkField
                  ref={editLinkRef}
                  label={t('shareTheme.edit-link')}
                  description={t('shareTheme.edit-link-description')}
                  link={links.edit}
                  copyLabel={t('shareTheme.copy-edit')}
                  isCopied={feedback === 'copied-edit'}
                  onCopy={() => copy('edit')}
                />
              </div>
              {/* Always there, and outside the buttons, so that screen readers read what is put in it. It keeps its height when empty. */}
              <Paragraph
                className={classes.feedback}
                data-size='sm'
                role='status'
              >
                {feedback &&
                  t(`shareTheme.${feedback}`) +
                    (announcements.current % 2 ? ' ' : '')}
              </Paragraph>
              <div className={classes.copy}>
                <Paragraph data-size='sm'>
                  {t('shareTheme.copy-description')}
                </Paragraph>
                <Button
                  variant='secondary'
                  data-size='sm'
                  onClick={create}
                  loading={status === 'creating'}
                >
                  {t(
                    status === 'creating'
                      ? 'shareTheme.creating'
                      : 'shareTheme.create-copy',
                  )}
                </Button>
              </div>
              {error}
            </Dialog.Block>
            <Divider style={{ margin: 0 }} />
            <Dialog.Block>
              <Button command='close' commandfor={dialogId}>
                {t('shareTheme.close')}
              </Button>
            </Dialog.Block>
          </>
        ) : (
          <>
            <Dialog.Block className={classes.content}>
              <Paragraph>{t('shareTheme.description')}</Paragraph>
              <Paragraph>{t('shareTheme.two-links')}</Paragraph>
              {error}
            </Dialog.Block>
            <Divider style={{ margin: 0 }} />
            <Dialog.Block>
              <div className={classes.actions}>
                <Button
                  ref={createRef}
                  onClick={create}
                  loading={status === 'creating'}
                >
                  {t(
                    status === 'creating'
                      ? 'shareTheme.creating'
                      : 'shareTheme.create',
                  )}
                </Button>
                <Button
                  variant='secondary'
                  command='close'
                  commandfor={dialogId}
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </Dialog.Block>
          </>
        )}
      </Dialog>
    </>
  );
};

/** A link in a field it can be selected in, with a button that copies it */
const LinkField = ({
  ref,
  label,
  description,
  link,
  copyLabel,
  isCopied,
  onCopy,
}: {
  ref: Ref<HTMLInputElement>;
  label: string;
  description: string;
  link: string;
  /** Says which link the button copies, as there is more than one copy button in the dialog */
  copyLabel: string;
  isCopied: boolean;
  onCopy: () => void;
}) => (
  <div className={classes.link}>
    <Textfield
      ref={ref}
      className={classes.field}
      label={label}
      description={description}
      value={link}
      readOnly
      onFocus={(event) => event.currentTarget.select()}
    />
    <Button variant='secondary' onClick={onCopy}>
      {isCopied ? <CheckmarkIcon aria-hidden /> : <FilesIcon aria-hidden />}
      {copyLabel}
    </Button>
  </div>
);
