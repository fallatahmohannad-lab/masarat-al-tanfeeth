import { useEffect, useState } from 'react'
import {
  Sparkles, Bot, X, ArrowLeft, ArrowRight, Compass, RotateCcw, CheckCircle2, Wand2,
} from 'lucide-react'
import { useApp } from '../../context/AppStateContext.jsx'

// Persona "lens" labels for the step badge.
const LENS = {
  sara: { ar: 'سارة · المقاول', en: 'Sara · Contractor' },
  khalid: { ar: 'خالد · المُقيّم', en: 'Khalid · Inspector' },
  financier: { ar: 'المموّل', en: 'Financier' },
}

// The full guided journey: each step navigates (role + page) and optionally
// fulfils prerequisites so the page shows its real content, then explains it.
const TOUR = [
  {
    kind: 'home', role: 'sara',
    title: { ar: 'مرحبًا بك في جولة «مسارات»', en: 'Welcome to the Masarat tour' },
    body: {
      ar: 'سأصطحبك في جولة كاملة عبر رحلة التنفيذ المحوكمة بالذكاء الاصطناعي — من المقاول «سارة» حتى «المموّل» — صفحةً بصفحة. اضغط «التالي» للبدء.',
      en: 'I’ll walk you through the full AI-governed execution journey — from contractor “Sara” to the “Financier” — page by page. Press Next to begin.',
    },
  },
  {
    kind: 'home', role: 'sara',
    title: { ar: 'لوحة المقاول', en: 'Contractor dashboard' },
    body: {
      ar: 'هنا تتابع محفظة مشاريعك: نِسب الإنجاز، وضع الصرف، وأين التأخير على شجرة WBS، وتحليلات الذكاء الاصطناعي الاستباقية (مخاطر التدفق النقدي، القائمة البديلة، جاهزية التمويل).',
      en: 'Track your project portfolio: completion, disbursement status, where the delay is on the WBS tree, and proactive AI insights (cash-flow risk, mandatory-list optimization, financing readiness).',
    },
  },
  {
    kind: 'step', step: 1, role: 'sara',
    title: { ar: 'الخطوة ١ · المطابقة والتسعير الذكي', en: 'Step 1 · AI Matching & Pricing' },
    body: {
      ar: 'تظهر منافسات «اعتماد» المطابقة لملف شركتك، ويُجري المحرّك تسعيرًا مبدئيًا لتقييم هامش الربح قبل شراء الكراسة.',
      en: 'Etimad tenders matched to your company profile appear here; the engine runs initial pricing to evaluate the margin before buying the booklet.',
    },
  },
  {
    kind: 'step', step: 2, role: 'sara', prep: 'booklet',
    title: { ar: 'الخطوة ٢ · الدراسة الذكية والترسية', en: 'Step 2 · AI Study & Award' },
    body: {
      ar: 'يولّد المحرّك دراسة فنية ومالية مقفلة (جداول WBS وBOQ)، جاهزة للرفع إلى «اعتماد» والمزامنة مع أنظمة ERP، ثم تتم محاكاة الترسية.',
      en: 'The engine generates a locked technical & financial study (WBS/BOQ), ready to upload to Etimad and sync with ERP, then the award is simulated.',
    },
  },
  {
    kind: 'step', step: 3, role: 'sara', prep: 'awarded',
    title: { ar: 'الخطوة ٣ · التحقق ورفع المستخلص', en: 'Step 3 · Claim Validation' },
    body: {
      ar: 'بعد التنفيذ ترفع المستخلص، ويتحقق المحرّك الذكي من مطابقته للـ WBS/BOQ المعتمدة، مع فحص المحتوى المحلي (LCGPA) قبل الإرسال إلى «اعتماد».',
      en: 'After delivery you raise the claim; the AI engine matches it to the approved WBS/BOQ with an LCGPA local-content check before submitting to Etimad.',
    },
  },
  {
    kind: 'step', step: 4, role: 'khalid', prep: 'submitted',
    title: { ar: 'الخطوة ٤ · التدقيق الذكي (خالد)', en: 'Step 4 · Smart Audit (Khalid)' },
    body: {
      ar: 'يستعرض المُقيّم قائمة فحص عشوائية ذكية؛ كل اعتماد أو رفض يُحدث «قيد حركة فنية» يعدّل النطاق المعتمد آليًا، مع دعم العمل الميداني دون اتصال.',
      en: 'The inspector reviews a random AI audit list; each approve/reject posts a technical movement entry that auto-adjusts the validated scope, with offline field support.',
    },
  },
  {
    kind: 'step', step: 5, role: 'financier', prep: 'audit',
    title: { ar: 'الخطوة ٥ · التمويل ومحرّك الإيراد (المموّل)', en: 'Step 5 · Financing & Revenue (Financier)' },
    body: {
      ar: 'يطلب المقاول تمويلًا على المستخلص المعتمد، ويراجع المموّل المخاطر، ثم «اعتماد وتمويل» يولّد إيرادًا فعليًا ويحدّث التدفّق النقدي — نهاية الرحلة.',
      en: 'The contractor requests financing on the approved claim; the financier reviews risk, then “Approve & Fund” generates real revenue and updates cash-flow — the journey’s end.',
    },
  },
  {
    kind: 'home', role: 'sara', finish: true,
    title: { ar: 'انتهت الجولة! 🎉', en: 'Tour complete! 🎉' },
    body: {
      ar: 'الآن استكشف أي صفحة بنفسك وبدّل الأدوار من الشريط العلوي (سارة · خالد · الجهة · المموّل). يمكنك إعادة الجولة في أي وقت من زر «الجولة الإرشادية».',
      en: 'Now explore any page yourself and switch roles from the top bar (Sara · Khalid · Owner · Financier). You can replay the tour anytime from the “Guided tour” button.',
    },
  },
]

export default function GuidedTour() {
  const app = useApp()
  const { state, lang, tx } = app
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const Back = lang === 'ar' ? ArrowRight : ArrowLeft
  const Fwd = lang === 'ar' ? ArrowLeft : ArrowRight

  // Auto-open once per page load so shared visitors are guided immediately.
  const [open, setOpen] = useState(true)
  const [i, setI] = useState(0)
  const s = TOUR[i]

  // Navigate + fulfil prerequisites whenever the active tour step changes.
  useEffect(() => {
    if (!open) return
    const t = TOUR[i]
    if (t.role) app.setRole(t.role)
    if (t.kind === 'home') app.setView('home')
    else app.enterJourney(t.step)

    // Auto-fulfil hard gates so each page renders its real content.
    const need = t.prep
    if (need) {
      if (!state.bookletBought) app.buyBooklet()
      if (need === 'awarded' || need === 'submitted' || need === 'audit') {
        if (!state.studyGenerated) app.generateStudy()
        if (!state.awarded) app.simulateAward()
      }
      if (need === 'submitted' || need === 'audit') {
        if (!state.claimRaised) app.raiseClaim()
        if (!state.claimVerified) app.validateClaim()
        if (!state.claimSubmitted) app.submitClaim()
      }
      if (need === 'audit' && !state.auditGenerated) app.generateAudit()
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, i])

  const total = TOUR.length
  const isLast = i === total - 1
  const next = () => (isLast ? setOpen(false) : setI((n) => Math.min(total - 1, n + 1)))
  const prev = () => setI((n) => Math.max(0, n - 1))
  const restart = () => { setI(0); setOpen(true) }

  // Floating launcher when the tour is closed.
  if (!open) {
    return (
      <button
        onClick={restart}
        dir={dir}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lift transition hover:bg-cyan-600"
      >
        <span className="relative grid h-6 w-6 place-items-center">
          <span className="absolute inline-flex h-6 w-6 animate-ping rounded-full bg-white/40" />
          <Wand2 className="h-4 w-4" />
        </span>
        {tx({ ar: 'الجولة الإرشادية', en: 'Guided tour' })}
      </button>
    )
  }

  const lens = s.role && LENS[s.role]

  return (
    <>
      {/* no full scrim — the assistant docks to the right and never blocks the page */}
      <div
        dir={dir}
        className="fixed right-4 top-1/2 z-50 max-h-[88vh] w-[340px] max-w-[88vw] -translate-y-1/2 overflow-y-auto animate-pop sm:right-5"
      >
        <div className="overflow-hidden rounded-2xl border border-cyan-200 bg-white shadow-lift">
          {/* progress bar */}
          <div className="h-1 w-full bg-cyan-50">
            <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${((i + 1) / total) * 100}%` }} />
          </div>

          <div className="p-4">
            {/* header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-700 text-white shadow-soft">
                  <Bot className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-teal-900">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                    {tx({ ar: 'مساعد مسارات الذكي', en: 'Masarat AI Guide' })}
                  </div>
                  <div className="text-[11px] text-teal-500">
                    {tx({ ar: 'الخطوة', en: 'Step' })} {i + 1} / {total}
                    {lens && <span className="ms-1.5 text-cyan-600">· {tx({ ar: 'بعدسة', en: 'lens' })}: {tx(lens)}</span>}
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-teal-400 hover:bg-page hover:text-teal-700" title={tx({ ar: 'تخطّي', en: 'Skip' })}>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* content */}
            <div className="mt-3">
              <div className="flex items-center gap-2 text-base font-bold text-teal-900">
                {s.finish ? <CheckCircle2 className="h-5 w-5 text-ok-500" /> : <Compass className="h-5 w-5 text-cyan-500" />}
                {tx(s.title)}
              </div>
              <p className="mt-1.5 text-sm leading-7 text-teal-700">{tx(s.body)}</p>
            </div>

            {/* footer */}
            <div className="mt-4 flex items-center justify-between">
              <button onClick={prev} disabled={i === 0} className="btn-outline px-3 py-2 text-sm disabled:opacity-40">
                <Back className="h-4 w-4" /> {tx({ ar: 'السابق', en: 'Back' })}
              </button>
              <div className="flex items-center gap-2">
                {!isLast && (
                  <button onClick={() => setOpen(false)} className="btn-ghost px-3 py-2 text-sm">{tx({ ar: 'تخطّي', en: 'Skip' })}</button>
                )}
                {isLast ? (
                  <button onClick={() => setOpen(false)} className="btn-ok px-4 py-2 text-sm">
                    <CheckCircle2 className="h-4 w-4" /> {tx({ ar: 'إنهاء الجولة', en: 'Finish tour' })}
                  </button>
                ) : (
                  <button onClick={next} className="btn-primary px-4 py-2 text-sm">
                    {tx({ ar: 'التالي', en: 'Next' })} <Fwd className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* replay hint on finish */}
        {s.finish && (
          <button onClick={restart} className="mx-auto mt-2 flex items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:underline">
            <RotateCcw className="h-3.5 w-3.5" /> {tx({ ar: 'إعادة الجولة', en: 'Replay tour' })}
          </button>
        )}
      </div>
    </>
  )
}
