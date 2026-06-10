import { Check } from 'lucide-react'
import { useApp } from '../../context/AppStateContext.jsx'

// The 5-step progress bar under the top bar. Steps are clickable so the demo can
// jump around; completed steps show a check, the current step is highlighted.
export default function Stepper() {
  const { state, lang, goStep, stepDone, STEPS } = useApp()
  return (
    <nav className="border-b border-line bg-white">
      <ol className="mx-auto flex max-w-[1280px] items-center gap-1 px-3 py-3 sm:gap-2 sm:px-4">
        {STEPS.map((s, i) => {
          const active = state.step === s.n
          const done = stepDone[s.n]
          return (
            <li key={s.n} className="flex flex-1 items-center">
              <button
                onClick={() => goStep(s.n)}
                className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-2 py-1.5 text-start transition sm:px-3 ${
                  active ? 'bg-cyan-50' : 'hover:bg-page'
                }`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold transition ${
                    done ? 'bg-ok-500 text-white' : active ? 'bg-cyan-500 text-white' : 'bg-page text-teal-500 ring-1 ring-line'
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : s.n}
                </span>
                <span className={`hidden min-w-0 truncate text-sm font-semibold md:block ${active ? 'text-teal-900' : 'text-teal-600'}`}>
                  {lang === 'ar' ? s.ar : s.en}
                </span>
              </button>
              {i < STEPS.length - 1 && <span className="mx-1 hidden h-px w-4 shrink-0 bg-line sm:block md:w-6" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
