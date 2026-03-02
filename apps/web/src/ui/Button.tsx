import type { ButtonHTMLAttributes } from "react"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost"
}

export function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-semibold transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
  const styles =
    variant === "primary"
      ? "bg-white text-black hover:bg-zinc-200"
      : variant === "secondary"
        ? "bg-zinc-800 text-white hover:bg-zinc-700"
        : "bg-transparent text-zinc-200 hover:bg-zinc-900"

  return <button className={`${base} ${styles} ${className}`} {...props} />
}