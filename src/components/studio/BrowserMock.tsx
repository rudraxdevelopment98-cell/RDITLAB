type Props = {
  label: string
  gradient: string
  className?: string
}

/** A lightweight fake browser window used as a reliable, image-free thumbnail. */
export function BrowserMock({ label, gradient, className = '' }: Props) {
  return (
    <div className={`overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-black/5 bg-slate-100 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 h-4 flex-1 rounded bg-white/70" />
      </div>
      <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 bg-grid-dark [background-size:22px_22px] opacity-40" />
        <span className="relative font-display text-xl font-bold text-white drop-shadow">{label}</span>
      </div>
    </div>
  )
}
