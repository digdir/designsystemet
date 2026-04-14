import { forwardRef, type HTMLAttributes } from 'react';
import type { ButtonProps } from '../button/button';
import { Button } from '../button/button';

export type FileUploadButtonProps = Pick<ButtonProps, 'variant'> &
  HTMLAttributes<HTMLSpanElement>;

export const FileUploadButton = forwardRef<
  HTMLSpanElement,
  FileUploadButtonProps
>(function FileUploadButton({ variant = 'secondary', ...rest }, ref) {
  return (
    <Button variant={variant} asChild>
      <span ref={ref} {...rest} />
    </Button>
  );
});
