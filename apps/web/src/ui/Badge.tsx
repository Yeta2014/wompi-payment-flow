export function Badge({ text, tone = "neutral" }: { text: string; tone?: "neutral" | "ok" | "warn" | "bad" }) {
  const cls =
    tone === "ok"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-600/30"
      : tone === "warn"
        ? "bg-yellow-500/15 text-yellow-200 border-yellow-600/30"
        : tone === "bad"
          ? "bg-red-500/15 text-red-300 border-red-600/30"
          : "bg-zinc-500/15 text-zinc-200 border-zinc-600/30"

  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>{text}</span>
}