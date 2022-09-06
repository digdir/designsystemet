import React from "react";
import { Button } from "./Button";
import { render } from "@testing-library/react";

describe("Button", () => {
  it("renders without crashing", () => {
    render(<Button>Click here</Button>);
  });
});
