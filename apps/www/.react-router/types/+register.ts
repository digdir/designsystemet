import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/:lang": {
    "lang": string;
  };
  "/:lang/monstre/:file": {
    "lang": string;
    "file": string;
  };
};