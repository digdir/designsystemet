import React, { FC } from "react";
import cn from "classnames";
import classes from "./Button.module.css";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
}

export const Button: FC<ButtonProps> = ({
  variant,
  size,
  type = "button",
  children,
}) => {
  return (
    <button
      type={type}
      className={cn(
        classes.button,
        classes[`button--${variant}`],
        classes[`button--${size}`]
      )}
    >
      {children}
    </button>
  );
};
