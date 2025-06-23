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

  // Add event listener to handle clicks on the dialog backdrop
  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog) {
      const handleClick = (event: MouseEvent) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;

        if (!isInDialog) {
          dialog.close();
        }
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
        {/** biome-ignore lint/a11y/noStaticElementInteractions: We still have the close button */}
        <div className={classes.dialogContent} onClick={closeFullImage}>
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
