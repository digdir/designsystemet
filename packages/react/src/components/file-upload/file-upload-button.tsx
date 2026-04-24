import { forwardRef, type HTMLAttributes } from 'react';
import type { ButtonProps } from '../button/button';
import { Button } from '../button/button';

export type FileUploadFakeButtonProps = Pick<ButtonProps, 'variant'> &
  HTMLAttributes<HTMLSpanElement>;

export const FileUploadFakeButton = forwardRef<
  HTMLSpanElement,
  FileUploadFakeButtonProps
>(function FileUploadFakeButton({ variant = 'secondary', ...rest }, ref) {
  return (
    <Button variant={variant} asChild>
      <span ref={ref} {...rest} />
    </Button>
  );
});
