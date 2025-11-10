import type { HeadingProps } from '@digdir/designsystemet-react';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { IconFrame } from '../icon-frame/icon-frame';

import classes from './banner.module.css';

type BannerProps = {
  icon: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const BannerRoot = ({ icon, className, children, ...props }: BannerProps) => {
  return (
    <div {...props} className={cl(classes.bannerContainer, className)}>
      <div className={classes.banner}>
        <div className={classes.text}>{children}</div>
        <IconFrame className={classes.iconFrame}>{icon}</IconFrame>
      </div>
    </div>
  );
};

type BannerHeadingProps = Omit<HeadingProps, 'size'>;

const BannerHeading = ({ className, ...props }: BannerHeadingProps) => {
  return (
    <Heading
      data-size='lg'
      className={cl(classes.heading, className)}
      {...props}
    />
  );
};

type BannerIngressProps = HTMLAttributes<HTMLParagraphElement>;

const BannerIngress = ({ className, ...props }: BannerIngressProps) => {
  return (
    <Paragraph
      variant='long'
      className={cl(classes.ingress, className)}
      {...props}
    />
  );
};

type BannerComponent = typeof BannerRoot & {
  Heading: typeof BannerHeading;
  Ingress: typeof BannerIngress;
};

const Banner: BannerComponent = BannerRoot as BannerComponent;

Banner.Heading = BannerHeading;
Banner.Ingress = BannerIngress;

export type { BannerProps, BannerHeadingProps };
export { Banner, BannerRoot, BannerHeading, BannerIngress };
