import type { ReactNode } from "react"
import { StepBar } from "./StepBar"

export function Page({
  title,
  subtitle,
  step,
  right,
  children,
}: {
  title: string
  subtitle?: string
  step: number
  right?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="absolute inset-0 -z-10 opacity-30 [background:radial-gradient(800px_circle_at_10%_0%,#22c55e33,transparent_60%),radial-gradient(800px_circle_at_90%_10%,#3b82f633,transparent_55%)]" />

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            {subtitle && <p className="text-zinc-400">{subtitle}</p>}
          </div>
          <div className="flex items-center justify-between gap-4">
            <StepBar current={step} />
            {right}
          </div>
        </header>

        {children}

        <footer className="pt-8 text-xs text-zinc-500">
          <p>Demo UX • Redux Persist (sin CVC) • API NestJS + Prisma • Hexagonal + ROP</p>
        </footer>
      </div>
    </div>
  )
}