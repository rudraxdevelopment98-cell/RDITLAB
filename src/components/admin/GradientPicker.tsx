'use client'

export const GRADIENT_PRESETS = [
  'from-violet-500 to-indigo-600',
  'from-fuchsia-500 to-purple-600',
  'from-sky-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-orange-500 to-rose-600',
  'from-rose-500 to-pink-600',
  'from-slate-600 to-slate-800',
  'from-cyan-500 to-blue-600',
  'from-lime-500 to-emerald-600',
]

export default function GradientPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">Card gradient</label>
      <div className="flex flex-wrap gap-2">
        {GRADIENT_PRESETS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => onChange(g)}
            aria-label={g}
            className={`h-9 w-9 rounded-lg bg-gradient-to-br ${g} ring-offset-2 transition ${
              value === g ? 'ring-2 ring-violet-600' : 'ring-0 hover:scale-105'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
