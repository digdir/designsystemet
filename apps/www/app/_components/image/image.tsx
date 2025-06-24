import { Button, Paragraph } from '@digdir/designsystemet-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './image.module.css';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  boxShadow?: boolean;
  caption?: string;
}

const Image = ({
  alt,
  src,
  boxShadow = false,
  caption,
  ...rest
}: ImageProps) => {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Handle dialog open/close
  const openFullImage = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeFullImage = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog) {
      const handleClick = () => {
        dialog.close();
      };

      dialog.addEventListener('click', handleClick);

      return () => {
        dialog.removeEventListener('click', handleClick);
      };
    }
  }, []);

  return (
    <figure className={cl(classes.container, boxShadow && classes.boxShadow)}>
      <button
        type='button'
        className={classes.imageWrapper}
        onClick={openFullImage}
        aria-label={`${alt}. ${t('image.aria-label.normal')}`}
      >
        <img className={classes.image} src={src} alt={alt} {...rest} />
      </button>

      <dialog ref={dialogRef} className={classes.imageDialog}>
        <div className={classes.dialogContent}>
          <img className={classes.dialogImage} src={src} alt={alt} />
          <Button
            className={classes.closeButton}
            onClick={closeFullImage}
            aria-label={t('image.aria-label.enlarged')}
            icon
            variant='tertiary'
          >
            <XMarkIcon />
          </Button>
          <div className={classes.dialogMessage}>
            {t('image.enlarged-text')}
          </div>
        </div>
      </dialog>

      {caption && (
        <Paragraph data-size='sm' asChild>
          <figcaption>{caption}</figcaption>
        </Paragraph>
      )}
    </figure>
  );
};

export { Image };
