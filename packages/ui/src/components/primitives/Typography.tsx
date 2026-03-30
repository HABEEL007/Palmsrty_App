/**
 * @file Typography.tsx
 */

import React from "react";
import "./Typography.css";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "caption"
    | "label";
  as?: React.ElementType;
}

export const Typography: React.FC<TypographyProps> = ({
  variant,
  as,
  children,
  className = "",
  ...props
}) => {
  const Component = as || (variant.startsWith("h") ? variant : "p");
  return (
    <Component
      className={`palm-text palm-text--${variant} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export const Spinner: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "md",
}) => <div className={`palm-spinner palm-spinner--${size}`} />;
