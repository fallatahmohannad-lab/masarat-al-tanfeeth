import { useEffect, useState } from 'react'
import {
  AlertOctagon, Clock, ShieldCheck, ShieldAlert, WifiOff, Lock, RefreshCw, MapPin,
  Wallet, Timer, CheckCircle2, PackageX, TrendingDown, Factory, Recycle, Ban, FileWarning,
} from 'lucide-react'
import { useApp } from '../../context/AppStateContext.jsx'
import { fmtSAR } from '../../data/mock.js'

// Strategic UX enhancements from the SIDF tender booklet (#4000003855).
// Fully bilingual via tx(); light-theme tokens only.

function addWorkingDays(startMs, days) {
  const d = new Date(startMs)
  let added = 0
  while (added < days) {
    d.setDate(d.getDate() + 1)
    const dow = d.getDay()
    if (dow !== 5 && dow !== 6) added += 1
  }
  return d.getTime()
}
function useTick(active) {
  const [, force] = useState(0)
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => force((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [active])
}
function breakdown(ms) {
  const c = Math.max(0, ms)
  return { days: Math.floor(c / 86_400_000), hours: Math.floor((c % 86_400_000) / 3_600_000), mins: Math.floor((c % 3_600_000) / 60_000), secs: Math.floor((c % 60_000) / 1000) }
}
const pad = (n) => String(n).padStart(2, '0')

// ───────────────────────── 1 · Feedback countdown (Section 8) ──────────────
export function FeedbackCountdownWidget({ isRejected, rejectionDate }) {
  const { tx } = useApp()
  useTick(isRejected)

  if (!isRejected) {
    return (
      <div className="animate-fadeUp flex items-center gap-2 rounded-xl border border-ok-100 bg-ok-50 px-4 py-3 text-sm text-ok-600">
        <ShieldCheck className="h-4 w-4" />
        {tx({ ar: 'لا توجد بنود مرفوضة حاليًا — جميع الأصول مقبولة وفق البند الثامن من كراسة الصندوق.', en: 'No rejected items — all assets accepted under Section 8 of the SIDF booklet.' })}
      </div>
    )
  }

  const deadline = addWorkingDays(rejectionDate ?? Date.now(), 7)
  const remaining = deadline - Date.now()
  const { days, hours, mins, secs } = breakdown(remaining)
  const overdue = remaining <= 0

  return (
    <div className="animate-pop rounded-xl border border-bad-100 bg-bad-50 p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-bad-500 text-white"><AlertOctagon className="h-5 w-5" /></span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-bad-600">{tx({ ar: 'إشعار حرج · رفض بند فني', en: 'Critical notice · technical item rejected' })}</h3>
            <span className="chip bg-white text-bad-600 ring-1 ring-bad-100">{tx({ ar: 'البند الثامن · رفض البنود', en: 'Section 8 · Item Rejection' })}</span>
          </div>
          <p className="mt-1 text-sm text-teal-800">
            {tx({ ar: 'رفض المهندس المعتمد (خالد) أحد الأصول المُورّدة. وفقًا للبند الثامن، يلتزم المقاول بإجراء التشخيص الفني والاستبدال خلال سبعة أيام عمل، وإلا تُطبَّق غرامات التأخير.', en: 'The certified engineer (Khalid) rejected a supplied asset. Per Section 8, the contractor must diagnose and replace within seven working days, or liquidated damages apply.' })}
          </p>
          <div className="mt-4">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-bad-600">
              <Clock className="h-3.5 w-3.5" />
              {overdue ? tx({ ar: 'انتهت المهلة — غرامة تأخير محتملة', en: 'Window elapsed — penalty likely' }) : tx({ ar: 'المتبقّي للتشخيص والاستبدال', en: 'Remaining to diagnose & replace' })}
            </div>
            <div className="flex items-center gap-2">
              {[{ v: days, l: tx({ ar: 'يوم', en: 'd' }) }, { v: hours, l: tx({ ar: 'ساعة', en: 'h' }) }, { v: mins, l: tx({ ar: 'دقيقة', en: 'm' }) }, { v: secs, l: tx({ ar: 'ثانية', en: 's' }) }].map((seg, i) => (
                <div key={i} className="flex flex-col items-center rounded-lg border border-bad-100 bg-white px-3 py-1.5">
                  <span className="tnum text-2xl font-bold text-bad-600">{pad(seg.v)}</span>
                  <span className="text-[10px] text-teal-500">{seg.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ──────────────────── 2 · Local-content validator (LCGPA gate) ─────────────
export function LocalContentValidatorWidget({ currentScore, targetScore, claimValue }) {
  const { lang, tx, state, localizeMaterial } = useApp()
  const met = currentScore >= targetScore
  const gap = Math.max(0, targetScore - currentScore)
  const nonCompliantBase = Math.round(claimValue * (gap / 100))
  const penalty = Math.round(nonCompliantBase * 0.3)
  const sar = tx({ ar: 'ر.س', en: 'SAR' })

  return (
    <div className={`animate-fadeUp card card-pad border ${met ? 'border-ok-100' : 'border-warn-500'}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-base font-bold text-teal-900">
          {met ? <ShieldCheck className="h-5 w-5 text-ok-500" /> : <ShieldAlert className="h-5 w-5 text-warn-500" />}
          {tx({ ar: 'فحص المحتوى المحلي · هيئة المحتوى المحلي (LCGPA)', en: 'Local-content check · LCGPA' })}
        </div>
        <span className={`chip ${met ? 'bg-ok-50 text-ok-600' : 'bg-warn-50 text-warn-600'}`}>{met ? tx({ ar: 'ممتثل', en: 'Compliant' }) : tx({ ar: 'غير ممتثل', en: 'Non-compliant' })}</span>
      </div>

      <div className="mb-1 flex items-end justify-between text-sm">
        <span className="text-teal-600">{tx({ ar: 'النسبة الحالية مقابل المستهدف الإلزامي', en: 'Current vs mandatory target' })}</span>
        <span className="tnum font-bold"><span className={met ? 'text-ok-600' : 'text-warn-600'}>{currentScore}%</span><span className="text-teal-400"> / {targetScore}%</span></span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-line">
        <div className={`h-full rounded-full transition-all duration-500 ${met ? 'bg-ok-500' : 'bg-warn-500'}`} style={{ width: `${Math.min(100, currentScore)}%` }} />
        <div className="absolute inset-y-0 w-0.5 bg-teal-700" style={{ insetInlineStart: `${targetScore}%` }} />
      </div>

      {!met ? (
        <>
          <div className="mt-4 rounded-xl border border-warn-500 bg-warn-50 p-3">
            <div className="flex items-center gap-2 text-sm font-bold text-warn-600"><Ban className="h-4 w-4" /> {tx({ ar: 'الإرسال المباشر إلى «اعتماد» مقيّد', en: 'Direct submission to Etimad is restricted' })}</div>
            <p className="mt-1 text-sm text-teal-800">{tx({ ar: `لا يمكن ترحيل المطالبة إلى «اعتماد» قبل بلوغ النسبة المستهدفة. فجوة الامتثال الحالية ${gap}%.`, en: `The claim cannot move to Etimad before the target is met. Current compliance gap: ${gap}%.` })}</p>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-page px-4 py-3">
              <div className="label">{tx({ ar: 'قيمة المشتريات غير الممتثلة', en: 'Non-compliant purchase value' })}</div>
              <div className="tnum mt-1 text-lg font-bold text-teal-900">{fmtSAR(nonCompliantBase)} {sar}</div>
            </div>
            <div className="rounded-xl border border-bad-100 bg-bad-50 px-4 py-3">
              <div className="label text-bad-600">{tx({ ar: 'غرامة متوقّعة (٣٠٪)', en: 'Expected penalty (30%)' })}</div>
              <div className="tnum mt-1 text-lg font-bold text-bad-600">{fmtSAR(penalty)} {sar}</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="label mb-2 flex items-center gap-1.5"><Recycle className="h-3.5 w-3.5" /> {tx({ ar: 'ارفع النسبة بتوطين المواد', en: 'Raise the score by localizing materials' })}</div>
            <ul className="space-y-2">
              {state.localMaterials.map((m) => (
                <li key={m.id} className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2">
                  <span className="flex items-center gap-2 text-sm text-teal-800"><Factory className="h-4 w-4 text-teal-400" /> {tx({ ar: m.nameAr, en: m.nameEn })} <span className="text-xs text-teal-500">+{m.points}%</span></span>
                  {m.isLocal ? (
                    <span className="chip bg-ok-50 text-ok-600"><CheckCircle2 className="h-3.5 w-3.5" /> {tx({ ar: 'موطّنة', en: 'Localized' })}</span>
                  ) : (
                    <button className="btn-soft px-3 py-1.5 text-xs" onClick={() => localizeMaterial(m.id)}><Recycle className="h-3.5 w-3.5" /> {tx({ ar: 'توطين المصدر', en: 'Localize source' })}</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-ok-100 bg-ok-50 px-4 py-3 text-sm text-ok-600">
          <CheckCircle2 className="h-4 w-4" />
          {tx({ ar: 'تم بلوغ نسبة المحتوى المحلي المطلوبة — أصبح الإرسال إلى «اعتماد» متاحًا.', en: 'Local-content target met — submission to Etimad is now available.' })}
        </div>
      )}
    </div>
  )
}

// ───────────────── 3 · Offline field mode banner (Section 7) ───────────────
export function OfflineFieldModeBanner({ isOffline, queueCount }) {
  const { tx } = useApp()
  if (!isOffline) return null
  return (
    <div className="animate-fadeUp mb-5 overflow-hidden rounded-xl border border-warn-500 bg-warn-50">
      <div className="flex flex-wrap items-center gap-3 p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-warn-500 text-white"><WifiOff className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 font-bold text-warn-600">
            {tx({ ar: 'الوضع الميداني دون اتصال مُفعّل', en: 'Offline field mode active' })}
            <span className="chip bg-white text-warn-600 ring-1 ring-warn-100"><MapPin className="h-3 w-3" /> {tx({ ar: 'شرورة / عرعر', en: 'Sharurah / Arar' })}</span>
          </div>
          <p className="mt-0.5 text-sm text-teal-800">{tx({ ar: 'استمرارية الأعمال (البند السابع): تُحفظ بيانات المعاينة الميدانية مشفّرة محليًا، وتُزامَن تلقائيًا مع سجل التدقيق غير القابل للتعديل فور عودة الاتصال.', en: 'Business continuity (Section 7): field-inspection data is encrypted locally and auto-syncs to the immutable audit spine once connectivity returns.' })}</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-warn-100 bg-white px-3 py-2">
          <Lock className="h-4 w-4 text-warn-600" />
          <div className="leading-tight">
            <div className="tnum text-lg font-bold text-warn-600">{queueCount}</div>
            <div className="text-[10px] text-teal-500">{tx({ ar: 'سجل بانتظار المزامنة', en: 'records queued' })}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 border-t border-warn-100 bg-white/60 px-4 py-1.5 text-xs text-teal-600">
        <RefreshCw className="h-3.5 w-3.5" /> {tx({ ar: 'ستتم المزامنة الآمنة تلقائيًا عند استعادة الشبكة.', en: 'Secure sync runs automatically when the network is restored.' })}
      </div>
    </div>
  )
}

// ──────────────── 4 · Framework task portfolio (trapped capital) ───────────
export function FrameworkTaskPortfolio({ openOrders }) {
  const { tx } = useApp()
  const orders = openOrders || []
  const totalTrapped = orders.reduce((s, o) => s + o.trappedCapital, 0)
  const atRisk = orders.filter((o) => o.daysLeft <= 3).length
  const sar = tx({ ar: 'ر.س', en: 'SAR' })
  const WINDOW = 3

  return (
    <div className="animate-fadeUp card card-pad">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-base font-bold text-teal-900">
          <Wallet className="h-5 w-5 text-cyan-500" />
          {tx({ ar: 'محفظة المهام المفتوحة · الاتفاقية الإطارية', en: 'Open task portfolio · framework agreement' })}
        </div>
        <span className="chip bg-page text-teal-600">{orders.length} {tx({ ar: 'أمر عمل', en: 'orders' })}</span>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-bad-100 bg-bad-50 px-4 py-3">
          <div className="label flex items-center gap-1.5 text-bad-600"><TrendingDown className="h-3.5 w-3.5" /> {tx({ ar: 'رأس المال العالق', en: 'Trapped capital' })}</div>
          <div className="tnum mt-1 text-xl font-bold text-bad-600">{fmtSAR(totalTrapped)} {sar}</div>
          <div className="mt-0.5 text-xs text-teal-600">{tx({ ar: 'سيولة مجمّدة حتى إغلاق أوامر العمل', en: 'Liquidity frozen until orders close' })}</div>
        </div>
        <div className="rounded-xl border border-line bg-page px-4 py-3">
          <div className="label flex items-center gap-1.5"><Timer className="h-3.5 w-3.5" /> {tx({ ar: 'ضمن نافذة ٣ أيام عمل', en: 'Within the 3-working-day window' })}</div>
          <div className="tnum mt-1 text-xl font-bold text-teal-900">{atRisk}<span className="text-sm font-medium text-teal-500"> / {orders.length}</span></div>
          <div className="mt-0.5 text-xs text-teal-600">{tx({ ar: 'أوامر تقترب من سقف التسليم الإلزامي', en: 'Orders nearing the mandatory delivery cap' })}</div>
        </div>
      </div>

      <ul className="space-y-2.5">
        {orders.map((o) => {
          const urgent = o.daysLeft <= 1
          const warn = o.daysLeft <= WINDOW
          const tone = urgent ? 'bad' : warn ? 'warn' : 'ok'
          const barPct = Math.min(100, (o.daysLeft / WINDOW) * 100)
          const barColor = urgent ? 'bg-bad-500' : warn ? 'bg-warn-500' : 'bg-ok-500'
          return (
            <li key={o.id} className="rounded-xl border border-line bg-white p-3.5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-semibold text-teal-900"><PackageX className="h-4 w-4 text-teal-400" /> {o.assetName}</div>
                  <div className="mt-0.5 font-mono text-xs text-teal-500">{o.wbsCode}</div>
                </div>
                <div className="text-end">
                  <div className="label">{tx({ ar: 'رأس مال عالق', en: 'Trapped' })}</div>
                  <div className="tnum font-bold text-teal-900">{fmtSAR(o.trappedCapital)} {sar}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                  <div className={`h-full rounded-full ${barColor} transition-all duration-500`} style={{ width: `${barPct}%` }} />
                </div>
                <span className={`chip shrink-0 ${tone === 'bad' ? 'bg-bad-50 text-bad-600' : tone === 'warn' ? 'bg-warn-50 text-warn-600' : 'bg-ok-50 text-ok-600'}`}>
                  <Timer className="h-3.5 w-3.5" /> {o.daysLeft} {tx({ ar: 'يوم متبقٍ', en: 'days left' })}
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-teal-600">
        <FileWarning className="h-3.5 w-3.5 text-warn-500" />
        {tx({ ar: 'تأخّر إغلاق أوامر العمل يجمّد التدفّق النقدي ويرفع مخاطر التمويل الزائد (Over-Factoring).', en: 'Late order closure freezes cash-flow and raises over-factoring risk.' })}
      </p>
    </div>
  )
}
