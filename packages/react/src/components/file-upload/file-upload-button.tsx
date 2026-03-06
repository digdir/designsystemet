import { forwardRef, type HTMLAttributes } from 'react';
import type { ButtonProps } from '../button/button';
import { Button } from '../button/button';

export type FileUploadButtonProps = Pick<ButtonProps, 'variant'> &
  HTMLAttributes<HTMLSpanElement>;

export const FileUploadButton = forwardRef<
  HTMLSpanElement,
  FileUploadButtonProps
>(function FileUploadButton(
  { className, variant = 'secondary', children, ...rest },
  ref,
) {
  return (
    <Button variant={variant} asChild>
      <span className={className} ref={ref} {...rest}>
        {children}
      </span>
    </Button>
  );
});
