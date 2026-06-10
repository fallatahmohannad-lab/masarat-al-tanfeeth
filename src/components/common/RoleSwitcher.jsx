import { useApp } from '../../context/AppStateContext.jsx'
import { ROLES } from '../../i18n/strings.js'

// Simple demo role switcher. Each role sees only what matters to them; switching
// is logged to the locked activity history.
export default function RoleSwitcher() {
  const { state, lang, setRole } = useApp()
  return (
    <div className="flex items-center gap-1 rounded-xl border border-line bg-white p-1">
      {ROLES.map((r) => {
        const active = state.role === r.id
        return (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            title={lang === 'ar' ? `${r.nameAr} · ${r.roleAr}` : `${r.nameEn} · ${r.roleEn}`}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition ${
              active ? 'bg-cyan-500 text-white shadow-soft' : 'text-teal-700 hover:bg-page'
            }`}
          >
            <span className={`grid h-6 w-6 place-items-center rounded-full text-xs ${active ? 'bg-white/20 text-white' : 'bg-page text-teal-700'}`}>
              {lang === 'ar' ? r.initial : r.initialEn}
            </span>
            <span className="hidden sm:inline">{lang === 'ar' ? r.nameAr : r.nameEn}</span>
          </button>
        )
      })}
    </div>
  )
}
