import { Languages, RotateCcw, ShieldCheck, Home } from 'lucide-react'
import { useApp } from '../../context/AppStateContext.jsx'
import RoleSwitcher from './RoleSwitcher.jsx'

// Always-present top bar: logo (→ home), language toggle, role switcher, and a
// gentle, persistent reassurance line.
export default function TopBar() {
  const { state, lang, t, tx, toggleLang, reset, setView } = useApp()
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-3">
        <button onClick={() => setView('home')} className="flex items-center gap-2.5 text-start" title={t('home')}>
          <img src={`${import.meta.env.BASE_URL}mark.svg`} alt="" className="h-9 w-9" />
          <div className="leading-tight">
            <div className="text-lg font-bold text-teal-900">{t('brand')}</div>
            <div className="hidden text-[11px] text-teal-600 sm:block">{t('brand_tag')}</div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('home')}
            className={`btn px-3 py-2 ${state.view === 'home' ? 'bg-cyan-500 text-white' : 'btn-outline'}`}
            title={t('home')}
          >
            <Home className="h-4 w-4" />
            <span className="hidden text-xs font-bold sm:inline">{t('home')}</span>
          </button>
          <RoleSwitcher />
          <button
            onClick={toggleLang}
            className="btn-outline px-3 py-2"
            title={lang === 'ar' ? 'English' : 'العربية'}
          >
            <Languages className="h-4 w-4" />
            <span className="text-xs font-bold">{lang === 'ar' ? 'EN' : 'ع'}</span>
          </button>
          <button onClick={reset} className="btn-ghost px-2.5 py-2" title={tx({ ar: 'إعادة البدء', en: 'Restart' })}>
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Persistent reassurance line */}
      <div className="border-t border-line bg-page">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-4 py-1.5 text-xs text-teal-600">
          <ShieldCheck className="h-3.5 w-3.5 text-ok-500" />
          {t('reassure')}
        </div>
      </div>
    </header>
  )
}
