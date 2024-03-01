declare module '@tokens-studio/sd-transforms' {
  import { Core } from 'style-dictionary';
  export declare function registerTransforms(sd: Core): Promise<void>;
  export declare function transformDimension(
    value: string | undefined | number,
  ): string | undefined;
}
