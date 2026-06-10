import { useState } from 'react'
import {
  Languages, ShieldCheck, Mail, BadgeCheck, Building2, Layers, Cpu, CheckCircle2,
  ArrowLeft, ArrowRight, Briefcase, Users, Lock, Sparkles, LogIn,
} from 'lucide-react'
import { useApp } from '../../context/AppStateContext.jsx'
import { Card, Badge } from '../common/ui.jsx'
import { SECTORS, COMPANY_SIZES, SUBSCRIPTION_TIERS } from '../../i18n/strings.js'

const TIER_ICONS = { Cpu, Layers, ShieldCheck }
const fmt = (n) => new Intl.NumberFormat('en-US').format(n)

export default function OnboardingContainer() {
  const { state, lang, t, tx, toggleLang, login, selectSubscription } = useApp()
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const Enter = lang === 'ar' ? ArrowLeft : ArrowRight

  const [email, setEmail] = useState('')
  const [cr, setCr] = useState('')
  const [sector, setSector] = useState('engineering')
  const [size, setSize] = useState('sme')
  const [validated, setValidated] = useState(false)

  const tier = state.selectedSubscriptionTier
  const lcTarget = COMPANY_SIZES.find((s) => s.value === size)?.lcTarget ?? 65
  const emailOk = /\S+@\S+\.\S+/.test(email)
  const canLogin = emailOk && cr.trim().length >= 6
  const canActivate = validated && tier !== 'none'

  const doLogin = () => { if (canLogin) setValidated(true) }
  const activate = () => {
    if (!canActivate) return
    login({
      profile: { companyEmail: email, crNumber: cr, sector, companySize: size, localContentTarget: lcTarget },
      tier,
    })
  }
  // One-click guest entry — skips sign-up straight into the platform + tour.
  const guestEnter = () =>
    login({
      profile: { companyEmail: 'guest@masarat.demo', crNumber: '0000000000', sector: 'engineering', companySize: 'sme', localContentTarget: 65 },
      tier: 'growth_sme',
    })

  return (
    <div className="min-h-screen bg-page" dir={dir}>
      {/* Minimal header */}
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <img src={`${import.meta.env.BASE_URL}mark.svg`} alt="" className="h-9 w-9" />
            <div className="leading-tight">
              <div className="text-lg font-bold text-teal-900">{t('brand')}</div>
              <div className="text-[11px] text-teal-600">{t('ob_tag')}</div>
            </div>
          </div>
          <button onClick={toggleLang} className="btn-outline px-3 py-2" title={lang === 'ar' ? 'English' : 'العربية'}>
            <Languages className="h-4 w-4" />
            <span className="text-xs font-bold">{lang === 'ar' ? 'EN' : 'ع'}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] space-y-6 px-4 py-8">
        {/* Hero */}
        <div className="animate-fadeUp text-center">
          <Badge tone="info" className="mx-auto"><Sparkles className="h-3.5 w-3.5" /> SIDF #4000003855</Badge>
          <h1 className="mt-3 text-2xl font-bold text-teal-900 sm:text-3xl">{t('ob_welcome')}</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-teal-600">{t('ob_welcome_sub')}</p>

          {/* One-click guest entry */}
          <div className="mt-4 flex flex-col items-center gap-1.5">
            <button onClick={guestEnter} className="btn-primary px-6 py-3 text-base shadow-lift">
              <LogIn className="h-5 w-5" /> {t('ob_guest')}
            </button>
            <span className="text-xs text-teal-500">{t('ob_guest_note')}</span>
          </div>

          <div className="mx-auto mt-5 flex max-w-xs items-center gap-3 text-xs text-teal-400">
            <span className="h-px flex-1 bg-line" />
            {t('ob_or')}
            <span className="h-px flex-1 bg-line" />
          </div>
        </div>

        {/* SECTION A + B (split) */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* A · Login */}
          <Card className="card-pad animate-fadeUp">
            <SecHead icon={Lock} step="A" title={t('ob_a_title')} sub={t('ob_a_sub')} />
            <label className="mt-4 block">
              <span className="label">{t('ob_email')}</span>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-line bg-white px-3 focus-within:border-cyan-500">
                <Mail className="h-4 w-4 text-teal-400" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('ob_email_ph')} dir="ltr"
                  className="w-full bg-transparent py-2.5 text-sm text-teal-900 placeholder:text-teal-300 focus:outline-none" />
              </div>
            </label>
            <label className="mt-3 block">
              <span className="label">{t('ob_cr')}</span>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-line bg-white px-3 focus-within:border-cyan-500">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <input value={cr} onChange={(e) => setCr(e.target.value.replace(/[^0-9]/g, ''))} placeholder={t('ob_cr_ph')} dir="ltr" maxLength={10}
                  className="w-full bg-transparent py-2.5 text-sm text-teal-900 placeholder:text-teal-300 focus:outline-none" />
              </div>
            </label>
            <button className="btn-primary mt-4 w-full" onClick={doLogin} disabled={!canLogin || validated}>
              {validated ? <BadgeCheck className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {validated ? t('ob_cr_validated') : t('ob_login')}
            </button>
            {validated && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-ok-100 bg-ok-50 px-3 py-2 text-sm text-ok-600">
                <CheckCircle2 className="h-4 w-4" /> {t('ob_cr_validated')}
              </div>
            )}
          </Card>

          {/* B · Profile builder */}
          <Card className="card-pad animate-fadeUp">
            <SecHead icon={Building2} step="B" title={t('ob_b_title')} sub={t('ob_b_sub')} />
            <div className="mt-4">
              <span className="label flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {t('ob_sector')}</span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {SECTORS.map((s) => (
                  <button key={s.id} onClick={() => setSector(s.id)}
                    className={`chip border px-3 py-1.5 transition-all duration-300 ${sector === s.id ? 'border-cyan-500 bg-cyan-50 text-teal-900 ring-1 ring-cyan-400' : 'border-line bg-white text-teal-700 hover:bg-page'}`}>
                    {tx(s.name)}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <span className="label flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {t('ob_size')}</span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {COMPANY_SIZES.map((s) => (
                  <button key={s.value} onClick={() => setSize(s.value)}
                    className={`chip border px-3 py-1.5 transition-all duration-300 ${size === s.value ? 'border-cyan-500 bg-cyan-50 text-cyan-700 ring-2 ring-cyan-100' : 'border-line bg-white text-teal-700 hover:bg-page'}`}>
                    {t(s.key)}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-page px-4 py-3">
              <div>
                <div className="label">{t('ob_lc_target')}</div>
                <div className="text-xs text-teal-500">{t('ob_lc_note')}</div>
              </div>
              <span className="tnum text-2xl font-bold text-cyan-600">{lcTarget}%</span>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-teal-600">
              <Cpu className="h-3.5 w-3.5 text-cyan-500" /> {t('ob_b_sub')}
            </p>
          </Card>
        </div>

        {/* SECTION C · Pricing matrix */}
        <div className="animate-fadeUp">
          <div className="mb-3 text-center">
            <h2 className="text-xl font-bold text-teal-900">{t('ob_c_title')}</h2>
            <p className="mt-1 text-sm text-teal-600">{t('ob_c_sub')}</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {SUBSCRIPTION_TIERS.map((p) => {
              const Icon = TIER_ICONS[p.icon] || Cpu
              const active = tier === p.id
              return (
                <div key={p.id}
                  className={`relative flex flex-col rounded-xl border bg-white p-5 transition-all duration-300 ${active ? 'border-cyan-500 ring-2 ring-cyan-100 shadow-lift' : p.recommended ? 'border-cyan-200 shadow-soft' : 'border-line'}`}>
                  {p.recommended && (
                    <span className="absolute -top-3 inset-x-0 mx-auto w-max rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold text-white shadow-soft">{t('ob_recommended')}</span>
                  )}
                  <div className={`grid h-12 w-12 place-items-center rounded-xl ${p.recommended ? 'bg-cyan-500 text-white' : 'bg-cyan-50 text-cyan-600'}`}><Icon className="h-6 w-6" /></div>
                  <h3 className="mt-3 text-base font-bold text-teal-900">{tx(p.name)}</h3>
                  <p className="mt-0.5 text-xs text-teal-600">{tx(p.tagline)}</p>
                  <div className="mt-3 flex items-end gap-1">
                    <span className="tnum text-3xl font-bold text-teal-900">{fmt(p.price)}</span>
                    <span className="mb-1 text-xs text-teal-600">{t('ob_per_month')}</span>
                  </div>
                  <ul className="mt-4 flex-1 space-y-2">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-teal-800">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ok-500" /> {tx(f)}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => selectSubscription(p.id)}
                    className={`mt-5 w-full ${active ? 'btn-ok' : p.recommended ? 'btn-primary' : 'btn-outline'}`}>
                    {active ? <><CheckCircle2 className="h-4 w-4" /> {t('ob_selected')}</> : t('ob_select_plan')}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Activate */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <button className="btn-primary px-7 py-3 text-base" onClick={activate} disabled={!canActivate}>
            <ShieldCheck className="h-5 w-5" /> {t('ob_activate')} <Enter className="h-5 w-5" />
          </button>
          {!canActivate && <p className="text-xs text-teal-600">{t('ob_need_all')}</p>}
        </div>
      </main>
    </div>
  )
}

function SecHead({ icon: Icon, step, title, sub }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-50 font-bold text-cyan-600"><Icon className="h-5 w-5" /></span>
      <div>
        <div className="flex items-center gap-2">
          <span className="chip bg-page text-teal-600">{step}</span>
          <h2 className="text-base font-bold text-teal-900">{title}</h2>
        </div>
        <p className="mt-0.5 text-xs text-teal-600">{sub}</p>
      </div>
    </div>
  )
}
