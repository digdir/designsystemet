import cl from 'clsx/lite';
import { forwardRef, type HTMLAttributes } from 'react';
import { Paragraph, type ParagraphProps } from '../paragraph/paragraph';

export type FileUploadDescriptionProps = ParagraphProps &
  HTMLAttributes<HTMLParagraphElement>;

export const FileUploadDescription = forwardRef<
  HTMLParagraphElement,
  FileUploadDescriptionProps
>(function FileUploadDescription({ className, ...rest }, ref) {
  return (
    <Paragraph
      className={cl(className, 'ds-file-upload__description')}
      ref={ref}
      {...rest}
    />
  );
});
