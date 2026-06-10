import { Lock, Dot } from 'lucide-react'
import { useApp } from '../../context/AppStateContext.jsx'
import { ROLES } from '../../i18n/strings.js'

const actorName = (id, lang) => {
  if (id === 'system') return lang === 'ar' ? 'النظام' : 'System'
  const r = ROLES.find((x) => x.id === id)
  return r ? (lang === 'ar' ? r.nameAr : r.nameEn) : id
}

const actorColor = {
  sara: 'text-cyan-600',
  khalid: 'text-teal-700',
  owner: 'text-ok-600',
  financier: 'text-warn-600',
  system: 'text-teal-400',
}

// The locked, tamper-proof activity history. Append-only timeline of everything
// that happened, in plain language. Newest first.
export default function ActivityHistory({ compact = false }) {
  const { state, lang, t } = useApp()
  const items = [...state.activity].reverse()

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Lock className="h-4 w-4 text-ok-500" />
        <span className="text-sm font-bold text-teal-900">{t('activity')}</span>
        <span className="chip bg-page text-teal-600">{state.activity.length}</span>
      </div>
      <ol className={`space-y-0 ${compact ? 'max-h-72 overflow-y-auto pe-1' : ''}`}>
        {items.map((e, idx) => (
          <li key={e.id} className="relative flex gap-3 ps-1">
            <div className="flex flex-col items-center">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white ring-1 ring-line">
                <Dot className={`h-5 w-5 ${actorColor[e.actor] || 'text-teal-400'}`} />
              </span>
              {idx < items.length - 1 && <span className="my-0.5 w-px flex-1 bg-line" />}
            </div>
            <div className="pb-3">
              <div className="text-sm text-teal-800">{lang === 'ar' ? e.ar : e.en}</div>
              <div className={`text-xs font-semibold ${actorColor[e.actor] || 'text-teal-400'}`}>{actorName(e.actor, lang)}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
