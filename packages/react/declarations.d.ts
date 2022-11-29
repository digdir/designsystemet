declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  const src: string;
  export default src;
}

declare module '*.css' {
  const styles: { [className: string]: string };
  export default styles;
}

declare module '*.png' {
  const value: any;
  export = value;
}
