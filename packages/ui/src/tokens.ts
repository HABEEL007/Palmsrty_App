/**
 * @file tokens.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description Design tokens for the PALMSTRY design system.
 */

export const tokens = {
  colors: {
    background: "#0a0a0c",
    primary: "#6366f1", // Indigo
    secondary: "#ec4899", // Pink
    accent: "#8b5cf6", // Violet
    text: "#f8fafc",
    muted: "#94a3b8",
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    overlay: "rgba(0, 0, 0, 0.6)",
    glass: "rgba(255, 255, 255, 0.05)",
    glassBorder: "rgba(255, 255, 255, 0.1)",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    glow: "0 0 15px rgba(99, 102, 241, 0.3)",
    glowLg: "0 0 30px rgba(99, 102, 241, 0.5)",
  },
  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    normal: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "500ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
};
