import React from "react";
import { Button } from "./Button";
import { render, screen } from "@testing-library/react";

describe("Button", () => {
  it("renders without crashing", () => {
    render(<Button>Click here</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click here");
  });
});
