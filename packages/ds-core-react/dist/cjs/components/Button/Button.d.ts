import * as React from "react";
export interface ButtonProps {
    variant?: "primary" | "secondary" | "success" | "danger";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
export declare namespace Button {
    var displayName: string;
}
