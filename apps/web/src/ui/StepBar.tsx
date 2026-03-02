const steps = ["Producto", "Checkout", "Resumen", "Pago", "Estado"]

export function StepBar({ current }: { current: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((s, idx) => {
        const active = idx === current
        const done = idx < current
        return (
          <div key={s} className="flex items-center gap-2">
            <div
              className={[
                "h-8 w-8 rounded-full grid place-items-center text-sm font-bold border",
                done ? "bg-emerald-500/15 border-emerald-600/30 text-emerald-200" : "",
                active ? "bg-white text-black border-white" : "",
                !active && !done ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "",
              ].join(" ")}
            >
              {idx + 1}
            </div>
            <span className={active ? "text-white font-semibold" : "text-zinc-400"}>{s}</span>
            {idx < steps.length - 1 && <span className="text-zinc-700 mx-1">—</span>}
          </div>
        )
      })}
    </div>
  )
}