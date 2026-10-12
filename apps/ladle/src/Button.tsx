import type { ButtonHTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", style, ...props }: ButtonProps) {
  const primary = variant === "primary";
  return (
    <button
      type="button"
      style={{
        padding: "0.5rem 1rem",
        borderRadius: 6,
        border: "1px solid #4f46e5",
        background: primary ? "#4f46e5" : "transparent",
        color: primary ? "#fff" : "#4f46e5",
        cursor: "pointer",
        ...style,
      }}
      {...props}
    />
  );
}
