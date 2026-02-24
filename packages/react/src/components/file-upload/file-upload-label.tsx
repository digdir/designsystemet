import { forwardRef, type HTMLAttributes } from 'react';
import { Paragraph, type ParagraphProps } from '../paragraph/paragraph';
import cl from 'clsx/lite';

export type FileUploadLabelProps = ParagraphProps &
  HTMLAttributes<HTMLParagraphElement>;

export const FileUploadLabel = forwardRef<
  HTMLParagraphElement,
  FileUploadLabelProps
>(function FileUploadLabel({ className, ...rest }, ref) {
  return (
    <Paragraph
      className={cl(className, 'ds-file-upload__label')}
      ref={ref}
      {...rest}
    />
  );
});
