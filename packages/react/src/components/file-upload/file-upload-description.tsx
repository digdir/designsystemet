import { forwardRef, type HTMLAttributes } from 'react';
import { Paragraph, type ParagraphProps } from '../paragraph/paragraph';

export type FileUploadDescriptionProps = ParagraphProps &
  HTMLAttributes<HTMLParagraphElement>;

export const FileUploadDescription = forwardRef<
  HTMLParagraphElement,
  FileUploadDescriptionProps
>(function FileUploadDescription(rest, ref) {
  return <Paragraph data-field='description' ref={ref} {...rest} />;
});
