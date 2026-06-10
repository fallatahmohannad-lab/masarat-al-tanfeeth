import { useEffect, useState } from 'react'
import {
  Sparkles, Bot, X, ArrowLeft, ArrowRight, Compass, CheckCircle2, Wand2,
} from 'lucide-react'
import { useApp } from '../../context/AppStateContext.jsx'

const LENS = {
  sara: { ar: 'سارة · المقاول', en: 'Sara · Contractor' },
  khalid: { ar: 'خالد · المُقيّم', en: 'Khalid · Inspector' },
  financier: { ar: 'المموّل', en: 'Financier' },
}

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
      ar: 'هنا تتابع محفظة مشاريعك: نِسب الإنجاز، وضع الصرف، وأين التأخير على شجرة WBS، وتحليلات الذكاء الاصطناعي الاستباقية.',
      en: 'Track your project portfolio: completion, disbursement status, where the delay is on the WBS tree, and proactive AI insights.',
    },
  },
  {
    kind: 'step', step: 1, role: 'sara',
    title: { ar: 'الخطوة ١ · المطابقة والتسعير الذكي', en: 'Step 1 · AI Matching & Pricing' },
    body: {
      ar: 'تظهر منافسات «اعتماد» المطابقة لملف شركتك، ويُجري المحرّك تسعيرًا مبدئيًا لتقييم هامش الربح قبل شراء الكراسة.',
      en: 'Etimad tenders matched to your company profile appear here; the engine runs initial pricing before buying the booklet.',
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
      en: 'The inspector reviews a random AI audit list; each approve/reject posts a technical movement entry that auto-adjusts the validated scope.',
    },
  },
  {
    kind: 'step', step: 5, role: 'financier', prep: 'audit',
    title: { ar: 'الخطوة ٥ · التمويل ومحرّك الإيراد (المموّل)', en: 'Step 5 · Financing & Revenue (Financier)' },
    body: {
      ar: 'يطلب المقاول تمويلًا على المستخلص المعتمد، ويراجع المموّل المخاطر، ثم «اعتماد وتمويل» يولّد إيرادًا فعليًا ويحدّث التدفّق النقدي — نهاية الرحلة.',
      en: 'The contractor requests financing; the financier reviews risk, then “Approve & Fund” generates real revenue and updates cash-flow — the journey’s end.',
    },
  },
  {
    kind: 'home', role: 'sara', finish: true,
    title: { ar: 'انتهت الجولة! 🎉', en: 'Tour complete! 🎉' },
    body: {
      ar: 'الآن استكشف أي صفحة بنفسك وبدّل الأدوار من الشريط العلوي. يمكنك إعادة الجولة في أي وقت من زر «الجولة الإرشادية».',
      en: 'Now explore any page yourself and switch roles from the top bar. Replay the tour anytime from the “Guided tour” button.',
    },
  },
]

export default function GuidedTour() {
  const app = useApp()
  const { state, lang, tx } = app
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const Back = lang === 'ar' ? ArrowRight : ArrowLeft
  const Fwd = lang === 'ar' ? ArrowLeft : ArrowRight

  const [open, setOpen] = useState(true)
  const [i, setI] = useState(0)
  const s = TOUR[i]

  useEffect(() => {
    if (!open) return
    const t = TOUR[i]
    if (t.role) app.setRole(t.role)
    if (t.kind === 'home') app.setView('home')
    else app.enterJourney(t.step)

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

  // Reserve space at the bottom so the fixed bar never hides page content.
  useEffect(() => {
    document.body.style.paddingBottom = open ? '150px' : ''
    return () => { document.body.style.paddingBottom = '' }
  }, [open])

  const total = TOUR.length
  const isLast = i === total - 1
  const next = () => (isLast ? setOpen(false) : setI((n) => Math.min(total - 1, n + 1)))
  const prev = () => setI((n) => Math.max(0, n - 1))
  const restart = () => { setI(0); setOpen(true) }

  // Floating launcher when closed.
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

  // Wide bottom dock bar — sits in the grey margin and never covers the cards.
  return (
    <div dir={dir} className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3">
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-2xl border border-cyan-200 bg-white shadow-lift">
        {/* progress */}
        <div className="h-1 w-full bg-cyan-50">
          <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${((i + 1) / total) * 100}%` }} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 p-3 sm:flex-nowrap sm:p-4">
          {/* avatar + meta */}
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-700 text-white shadow-soft">
              <Bot className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5 text-sm font-bold text-teal-900">
                <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                {tx({ ar: 'مساعد مسارات الذكي', en: 'Masarat AI Guide' })}
              </div>
              <div className="text-[11px] text-teal-500">
                {tx({ ar: 'الخطوة', en: 'Step' })} {i + 1}/{total}
                {lens && <span className="ms-1 text-cyan-600">· {tx(lens)}</span>}
              </div>
            </div>
          </div>

          {/* divider */}
          <span className="hidden h-10 w-px bg-line sm:block" />

          {/* title + body */}
          <div className="min-w-[220px] flex-1">
            <div className="flex items-center gap-2 text-sm font-bold text-teal-900">
              {s.finish ? <CheckCircle2 className="h-4 w-4 text-ok-500" /> : <Compass className="h-4 w-4 text-cyan-500" />}
              {tx(s.title)}
            </div>
            <p className="mt-0.5 text-sm leading-6 text-teal-700">{tx(s.body)}</p>
          </div>

          {/* controls */}
          <div className="flex shrink-0 items-center gap-2">
            <button onClick={prev} disabled={i === 0} className="btn-outline px-3 py-2 text-sm disabled:opacity-40">
              <Back className="h-4 w-4" /> {tx({ ar: 'السابق', en: 'Back' })}
            </button>
            {!isLast && (
              <button onClick={() => setOpen(false)} className="btn-ghost px-3 py-2 text-sm">{tx({ ar: 'تخطّي', en: 'Skip' })}</button>
            )}
            {isLast ? (
              <button onClick={() => setOpen(false)} className="btn-ok px-4 py-2 text-sm">
                <CheckCircle2 className="h-4 w-4" /> {tx({ ar: 'إنهاء', en: 'Finish' })}
              </button>
            ) : (
              <button onClick={next} className="btn-primary px-4 py-2 text-sm">
                {tx({ ar: 'التالي', en: 'Next' })} <Fwd className="h-4 w-4" />
              </button>
            )}
            <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-teal-400 hover:bg-page hover:text-teal-700" title={tx({ ar: 'إغلاق', en: 'Close' })}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
