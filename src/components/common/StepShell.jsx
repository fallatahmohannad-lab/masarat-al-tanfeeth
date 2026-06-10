import { useApp } from '../../context/AppStateContext.jsx'

// Consistent step header + content wrapper.
export default function StepShell({ step, title, subtitle, children, aside }) {
  const { tx } = useApp()
  return (
    <div className="animate-fadeUp">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="chip bg-cyan-50 text-cyan-700">
            {tx({ ar: 'الخطوة', en: 'Step' })} {step} / 5
          </span>
          <h1 className="mt-2 text-2xl font-bold text-teal-900">{title}</h1>
          {subtitle && <p className="mt-1 max-w-2xl text-sm text-teal-600">{subtitle}</p>}
        </div>
        {aside && <div>{aside}</div>}
      </div>
      {children}
    </div>
  )
}
