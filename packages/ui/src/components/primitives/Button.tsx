/**
 * @file Button.tsx
 */

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import './Button.css';

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

/**
 * Premium Button component with glow effects and smooth transitions.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn('palm-btn', `palm-btn--${variant}`, `palm-btn--${size}`, className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="palm-btn__spinner" /> : children}
    </button>
  );
};
