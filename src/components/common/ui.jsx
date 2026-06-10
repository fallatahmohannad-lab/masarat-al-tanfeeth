// Shared light-theme presentational primitives (cyan-on-white design system).

export function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>
}

export function Badge({ tone = 'neutral', children, className = '' }) {
  const map = {
    neutral: 'bg-page text-teal-700 border border-line',
    info: 'bg-cyan-50 text-cyan-700',
    ok: 'bg-ok-50 text-ok-600',
    warn: 'bg-warn-50 text-warn-600',
    bad: 'bg-bad-50 text-bad-600',
  }
  return <span className={`chip ${map[tone]} ${className}`}>{children}</span>
}

export function SectionTitle({ icon: Icon, children, hint }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 text-base font-bold text-teal-900">
        {Icon && <Icon className="h-5 w-5 text-cyan-500" />}
        {children}
      </div>
      {hint && <p className="mt-1 text-sm text-teal-600">{hint}</p>}
    </div>
  )
}

export function StatCard({ label, value, sub, tone = 'default', icon: Icon }) {
  const tones = {
    default: 'text-teal-900',
    ok: 'text-ok-600',
    warn: 'text-warn-600',
    bad: 'text-bad-600',
    cyan: 'text-cyan-600',
  }
  return (
    <Card className="card-pad">
      <div className="flex items-start justify-between">
        <span className="label">{label}</span>
        {Icon && <Icon className="h-5 w-5 text-teal-400" />}
      </div>
      <div className={`mt-2 stat ${tones[tone]}`}>{value}</div>
      {sub && <div className="mt-1 text-sm text-teal-600">{sub}</div>}
    </Card>
  )
}

export function ProgressBar({ value, tone = 'cyan' }) {
  const bar = { cyan: 'bg-cyan-500', ok: 'bg-ok-500', warn: 'bg-warn-500', bad: 'bg-bad-500' }[tone]
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-line">
      <div className={`h-full rounded-full ${bar} transition-all duration-500`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

// Friendly outcome banner used at the end of steps.
export function Banner({ tone = 'info', icon: Icon, title, children }) {
  const map = {
    info: 'border-cyan-200 bg-cyan-50 text-teal-800',
    ok: 'border-ok-100 bg-ok-50 text-ok-600',
    warn: 'border-warn-100 bg-warn-50 text-warn-600',
    bad: 'border-bad-100 bg-bad-50 text-bad-600',
  }
  return (
    <div className={`animate-fadeUp rounded-xl border p-4 ${map[tone]}`}>
      <div className="flex items-start gap-3">
        {Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0" />}
        <div>
          {title && <div className="font-bold">{title}</div>}
          {children && <div className="mt-0.5 text-sm opacity-90">{children}</div>}
        </div>
      </div>
    </div>
  )
}
