import cl from 'clsx/lite';

import classes from './responsive-iframe.module.css';

// Exported since `defaultComponents` in mdx-components.tsx is, and its type names this one
export interface ResponsiveIframeProps {
  aspectRatio: '16-9' | '4-3';
  title: string;
  src: string;
}

const ResponsiveIframe = ({
  aspectRatio = '16-9',
  title,
  src,
  ...rest
}: ResponsiveIframeProps) => {
  return (
    <div
      className={cl(classes.container, {
        [classes.aspectFourThree]: aspectRatio === '4-3',
      })}
      data-iframe-video
    >
      <iframe
        title={title}
        src={src}
        className={classes.iframe}
        {...rest}
      ></iframe>
    </div>
  );
};

export { ResponsiveIframe };
