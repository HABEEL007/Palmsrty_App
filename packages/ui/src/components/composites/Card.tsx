/**
 * @file Card.tsx
 */

import React from "react";
import "./Card.css";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass";
  isGlow?: boolean;
}

/**
 * Card component with optional glassmorphism and glow effects.
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  isGlow = false,
  className = "",
  ...props
}) => {
  const classes = [
    "palm-card",
    variant === "glass" ? "glass" : "",
    isGlow ? "palm-card--glow" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
