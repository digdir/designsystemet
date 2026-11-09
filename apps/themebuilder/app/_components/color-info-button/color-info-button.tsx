import type { Color } from '@digdir/designsystemet/internal';
import { Button } from '@digdir/designsystemet-react';
import { QuestionmarkCircleIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useTranslation } from 'react-i18next';
import { useColorModalContext } from '~/_utils/color-modal-context';
import classes from './color-info-button.module.css';

type ColorInfoButtonProps = {
  /** The color step, `color.name` is the semantic token name, e.g. `background-default` */
  color: Color;
  /** Color name, e.g. `accent` */
  namespace: string;
  className?: string;
};

/** Small icon button that opens the info modal for one color step */
export const ColorInfoButton = ({
  color,
  namespace,
  className,
}: ColorInfoButtonProps) => {
  const { t } = useTranslation();
  const { openColorModal } = useColorModalContext();

  return (
    <Button
      icon
      variant='tertiary'
      data-color='neutral'
      data-size='sm'
      className={cl(classes.button, className)}
      aria-haspopup='dialog'
      aria-label={t('color-modal.see-more', {
        namespace,
        color: color.displayName,
      })}
      onClick={() => openColorModal(color, namespace)}
    >
      <QuestionmarkCircleIcon aria-hidden />
    </Button>
  );
};
