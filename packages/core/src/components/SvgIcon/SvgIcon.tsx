import type { SVGAttributes } from 'react';
import { isValidElement, cloneElement } from 'react';
import type React from 'react';

export type IconComponentProps = {
  svgIconComponent: React.ReactNode;
};

export type SvgIconProps = IconComponentProps & SVGAttributes<SVGElement>;

export const SvgIcon = ({ svgIconComponent, ...rest }: SvgIconProps) => {
  if (isValidElement(svgIconComponent)) {
    return cloneElement(svgIconComponent, { ...rest });
  }
  return null;
};
