import { Heading, Ingress } from '@digdir/designsystemet-react';
import type { HeadingProps } from '@digdir/designsystemet-react';
import cl from 'clsx';
import { createContext, useContext, type HTMLAttributes } from 'react';

import classes from './Banner.module.css';

type BanneContextProps = {
  color: NonNullable<BannerProps['color']>;
};

const BannerContext = createContext<BanneContextProps>({
  color: 'red',
});

type BannerProps = {
  color?: 'blue' | 'red' | 'yellow';
} & HTMLAttributes<HTMLDivElement>;

const BannerRoot = ({
  color = 'red',
  className,
  children,
  ...props
}: BannerProps) => {
  return (
    <BannerContext.Provider value={{ color }}>
      <div
        {...props}
        className={cl(classes.banner, className)}
      >
        {children}
        <BannerLogoSvg />
      </div>
    </BannerContext.Provider>
  );
};

type BannerHeadingProps = Omit<HeadingProps, 'size'>;

const BannerHeading = ({ ...props }: BannerHeadingProps) => {
  return (
    <Heading
      size='lg'
      {...props}
    />
  );
};

type BannerIngressProps = HTMLAttributes<HTMLParagraphElement>;

const BannerIngress = ({ className, ...props }: BannerIngressProps) => {
  return (
    <Ingress
      className={cl(classes.ingress, className)}
      {...props}
    />
  );
};

type BanneIconProps = HTMLAttributes<HTMLDivElement>;

const BannerIcon = ({ className, ...props }: BanneIconProps) => {
  const { color } = useContext(BannerContext);

  return (
    <div
      className={cl(classes.icon, classes[color], className)}
      {...props}
    />
  );
};

type BannerComponent = typeof BannerRoot & {
  Heading: typeof BannerHeading;
  Ingress: typeof BannerIngress;
  Icon: typeof BannerIcon;
};

const Banner: BannerComponent = BannerRoot as BannerComponent;

Banner.Heading = BannerHeading;
Banner.Ingress = BannerIngress;
Banner.Icon = BannerIcon;

export type { BannerProps, BannerHeadingProps };
export { Banner, BannerRoot, BannerHeading, BannerIngress, BannerIcon };

const BannerLogoSvg = () => {
  const { color } = useContext(BannerContext);

  const svgClass = ('svg-' + color) as 'svg-red' | 'svg-blue' | 'svg-yellow';

  return (
    <svg
      className={cl(classes.logo, classes[svgClass])}
      xmlns='http://www.w3.org/2000/svg'
      width='361'
      height='361'
      viewBox='0 0 361 361'
      fill='none'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M83.2949 106.495L10.1217 179.668L83.2949 252.841L156.468 179.668L83.2949 106.495ZM87.543 101.185C85.1969 98.8387 81.393 98.8387 79.0468 101.185L4.81154 175.42C2.46538 177.766 2.46537 181.57 4.81154 183.916L79.0468 258.152C81.393 260.498 85.1969 260.498 87.543 258.152L161.778 183.916C164.124 181.57 164.124 177.766 161.778 175.42L87.543 101.185Z'
        fill='#E5AA20'
        fillOpacity='0.25'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M277.042 106.495L203.869 179.668L277.042 252.841L350.215 179.668L277.042 106.495ZM281.29 101.185C278.944 98.8387 275.14 98.8387 272.794 101.185L198.559 175.42C196.212 177.766 196.212 181.57 198.559 183.916L272.794 258.152C275.14 260.498 278.944 260.498 281.29 258.152L355.525 183.916C357.872 181.57 357.872 177.766 355.525 175.42L281.29 101.185Z'
        fill='#E5AA20'
        fillOpacity='0.25'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M180.294 9.62136L107.121 82.7946L180.294 155.968L253.468 82.7946L180.294 9.62136ZM184.543 4.31122C182.196 1.96505 178.392 1.96505 176.046 4.31122L101.811 78.5465C99.4649 80.8927 99.4649 84.6965 101.811 87.0427L176.046 161.278C178.392 163.624 182.196 163.624 184.543 161.278L258.778 87.0427C261.124 84.6965 261.124 80.8927 258.778 78.5465L184.543 4.31122Z'
        fill='#E5AA20'
        fillOpacity='0.25'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M180.294 204.621L107.121 277.795L180.294 350.968L253.468 277.795L180.294 204.621ZM184.543 199.311C182.196 196.965 178.392 196.965 176.046 199.311L101.811 273.546C99.4649 275.893 99.4649 279.697 101.811 282.043L176.046 356.278C178.392 358.624 182.196 358.624 184.543 356.278L258.778 282.043C261.124 279.697 261.124 275.893 258.778 273.546L184.543 199.311Z'
        fill='#E5AA20'
        fillOpacity='0.25'
      />
    </svg>
  );
};
