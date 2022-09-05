import * as React from "react";
import cn from "classnames";
import classes from "./Button.module.css";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button(props: ButtonProps) {
  return <button className={cn(
      classes.button,
      classes[`button--${props.variant}`],
      classes[`button--${props.size}`]
  )}>{props.children}</button>;
}

Button.displayName = "Button";
