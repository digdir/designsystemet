import { Button, Tooltip } from '@digdir/designsystemet-react';
import { ClipboardIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import classes from './clipboard-button.module.css';

interface ClipboardButtonProps {
  title?: string;
  value: string;
  text?: string;
  ariaLabel?: string;
}

export const ClipboardButton = ({
  title = 'clipboard-button.copy',
  value,
  text,
  ariaLabel,
}: ClipboardButtonProps) => {
  const { t } = useTranslation();
  const [toolTipText, setToolTipText] = useState(title);

  const onBtnClick = (text: string) => {
    setToolTipText('clipboard-button.copied');
    navigator.clipboard.writeText(text).catch((reason) => {
      throw Error(String(reason));
    });
  };

  return (
    <>
      {/* @ts-ignore -- we trust the string passed to t() here */}
      <Tooltip content={t(toolTipText)}>
        <Button
          onMouseEnter={() =>
            setToolTipText(
              title === 'clipboard-button.copy' && ariaLabel
                ? ariaLabel
                : // @ts-ignore -- we trust the string passed to t() here
                  t(title),
            )
          }
          onClick={() => onBtnClick(value)}
          icon={!text}
          variant='tertiary'
          data-color='neutral'
          data-size='sm'
          aria-label={ariaLabel}
        >
          <ClipboardIcon aria-hidden='true' />
          {text && <span className={classes.text}>{text}</span>}
        </Button>
      </Tooltip>
    </>
  );
};
