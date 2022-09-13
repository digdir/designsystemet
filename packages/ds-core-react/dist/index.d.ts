import * as React from 'react';

interface ButtonProps {
    variant?: "primary" | "secondary" | "success" | "danger";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}
declare function Button(props: ButtonProps): JSX.Element;
declare namespace Button {
    var displayName: string;
}

export { Button, ButtonProps };
