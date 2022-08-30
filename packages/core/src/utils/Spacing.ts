import tokens from "@digdir/ds-tokens/build/tokens";

export type SpacingTypes = 1 | 2 | 3 | 4 | 5 | 6;

declare interface DesignToken {
  value: any;
  name?: string;
  comment?: string;
  themeable?: boolean;
  attributes?: {
    category?: string;
    type?: string;
    item?: string;
    subitem?: string;
    state?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export const getSpacing = (spacing: SpacingTypes) => {
  switch (spacing) {
    case 1:
      return tokens.spacing["1"] as DesignToken;
    case 2:
      return tokens.spacing["2"];
    case 3:
      return tokens.spacing["3"];
    case 4:
      return tokens.spacing["4"];
    case 5:
      return tokens.spacing["5"];
    case 6:
      return tokens.spacing["6"];
    default:
      return "0px";
  }
};
