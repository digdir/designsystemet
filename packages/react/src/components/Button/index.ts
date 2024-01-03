import { Button as ButtonRoot, ButtonIcon } from './Button';

type ButtonComponent = typeof ButtonRoot & {
  Icon: typeof ButtonIcon;
};

const Button = ButtonRoot as ButtonComponent;

Button.Icon = ButtonIcon;

export type { ButtonProps } from './Button';
export { Button, ButtonIcon };
