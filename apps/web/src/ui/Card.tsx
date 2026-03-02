import type { ReactNode } from "react"

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-xl">{children}</div>
}

export function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="p-5 border-b border-zinc-800">
      <h2 className="text-xl font-semibold">{title}</h2>
      {subtitle && <p className="text-zinc-400 mt-1">{subtitle}</p>}
    </div>
  )
}

export function CardBody({ children }: { children: ReactNode }) {
  return <div className="p-5">{children}</div>
}