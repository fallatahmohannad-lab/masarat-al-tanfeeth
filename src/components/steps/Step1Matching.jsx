import { useState } from 'react'
import {
  Cpu, Target, Building2, TrendingUp, ShoppingCart, CheckCircle2, Loader2, Sparkles, Gauge,
} from 'lucide-react'
import { useApp } from '../../context/AppStateContext.jsx'
import { Card, Badge, Banner, SectionTitle, ProgressBar } from '../common/ui.jsx'
import StepShell from '../common/StepShell.jsx'
import StepNav from '../common/StepNav.jsx'
import { ETIMAD_MATCHES } from '../../data/aiFlow.js'
import { fmtSAR } from '../../data/mock.js'

export default function Step1Matching() {
  const { state, tx, selectTender, runPricing, buyBooklet } = useApp()
  const [pricing, setPricing] = useState(false)
  const tender = ETIMAD_MATCHES.find((t) => t.id === state.selectedTender) || ETIMAD_MATCHES[0]
  const expectedProfit = Math.round((tender.value * tender.marginPct) / 100)

  const doPricing = () => {
    setPricing(true)
    setTimeout(() => {
      setPricing(false)
      runPricing()
    }, 1000)
  }

  return (
    <StepShell
      step={1}
      title={tx({ ar: 'المطابقة والتسعير المبدئي الذكي', en: 'AI Matching & Initial Pricing' })}
      subtitle={tx({ ar: 'مطابقة المنافسات من «اعتماد» وفق ملف الشركة، ثم تقييم هامش الربح آليًا قبل شراء الكراسة.', en: 'Match Etimad tenders to the company profile, then evaluate the profit margin before buying the booklet.' })}
      aside={<Badge tone="info"><Cpu className="h-3.5 w-3.5" /> {tx({ ar: 'المرحلة: المطابقة', en: 'Stage: matching' })}</Badge>}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Matches */}
        <Card className="card-pad">
          <SectionTitle icon={Target} hint={tx({ ar: 'مرتّبة حسب نسبة الملاءمة مع ملف الشركة.', en: 'Ranked by fit with the company profile.' })}>
            {tx({ ar: 'منافسات مطابِقة من «اعتماد»', en: 'Matching tenders from Etimad' })}
          </SectionTitle>
          <ul className="space-y-2.5">
            {ETIMAD_MATCHES.map((m) => {
              const active = m.id === state.selectedTender
              return (
                <li key={m.id}>
                  <button
                    onClick={() => selectTender(m.id)}
                    className={`w-full rounded-xl border p-3.5 text-start transition ${active ? 'border-cyan-300 bg-cyan-50/60 shadow-soft' : 'border-line bg-white hover:bg-page'}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-teal-900">{tx(m.title)}</div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-teal-600"><Building2 className="h-3.5 w-3.5" /> {tx(m.entity)}</div>
                      </div>
                      <Badge tone={m.fit >= 90 ? 'ok' : m.fit >= 80 ? 'cyan' : 'warn'}>
                        <Gauge className="h-3.5 w-3.5" /> {tx({ ar: 'ملاءمة', en: 'fit' })} {m.fit}%
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-teal-600">
                      <span>{tx({ ar: 'القيمة التقديرية', en: 'Est. value' })}: <b className="tnum text-teal-900">{fmtSAR(m.value)} {tx({ ar: 'ر.س', en: 'SAR' })}</b></span>
                      <span>{tx({ ar: 'هامش متوقّع', en: 'Margin' })}: <b className="text-teal-900">{m.marginPct}%</b></span>
                      <span>{tx({ ar: 'رسوم الكراسة', en: 'Booklet fee' })}: <b className="text-teal-900">{fmtSAR(m.bookletFee)} {tx({ ar: 'ر.س', en: 'SAR' })}</b></span>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </Card>

        {/* Pricing panel */}
        <div className="lg:sticky lg:top-44 lg:self-start">
          <Card className="card-pad">
            <SectionTitle icon={Sparkles}>{tx({ ar: 'التسعير المبدئي الذكي', en: 'Initial AI pricing' })}</SectionTitle>
            <div className="rounded-xl border border-line bg-page px-4 py-3 text-sm">
              <div className="font-bold text-teal-900">{tx(tender.title)}</div>
              <div className="mt-1 text-xs text-teal-600">{tx(tender.entity)}</div>
            </div>

            {state.pricingEvaluated ? (
              <div className="mt-3 animate-fadeUp space-y-3">
                <div className="rounded-xl border border-ok-100 bg-ok-50 px-4 py-3">
                  <div className="label text-ok-600">{tx({ ar: 'هامش الربح المتوقّع', en: 'Expected profit margin' })}</div>
                  <div className="tnum mt-1 text-2xl font-bold text-ok-600">{fmtSAR(expectedProfit)} {tx({ ar: 'ر.س', en: 'SAR' })}</div>
                  <div className="mt-1 text-xs text-teal-600">{tx({ ar: `بنسبة ${tender.marginPct}% من القيمة التقديرية`, en: `${tender.marginPct}% of the estimated value` })}</div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-teal-600">{tx({ ar: 'جاذبية الفرصة', en: 'Opportunity attractiveness' })}</span>
                    <span className="font-bold text-teal-900">{tender.fit}%</span>
                  </div>
                  <ProgressBar value={tender.fit} tone="cyan" />
                </div>
                {state.bookletBought ? (
                  <Banner tone="ok" icon={CheckCircle2} title={tx({ ar: 'تم شراء الكراسة — انتقل لتوليد الدراسة.', en: 'Booklet purchased — proceed to study generation.' })} />
                ) : (
                  <button className="btn-primary w-full" onClick={buyBooklet}>
                    <ShoppingCart className="h-4 w-4" /> {tx({ ar: 'شراء كراسة المنافسة', en: 'Buy the RFP booklet' })}
                  </button>
                )}
              </div>
            ) : (
              <button className="btn-primary mt-3 w-full" onClick={doPricing} disabled={pricing}>
                {pricing ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
                {pricing ? tx({ ar: 'جارٍ التحليل…', en: 'Analyzing…' }) : tx({ ar: 'التسعير المبدئي الذكي', en: 'Initial AI pricing' })}
              </button>
            )}
          </Card>
        </div>
      </div>

      <StepNav nextDisabled={!state.bookletBought} nextLabel={tx({ ar: 'إلى الدراسة الذكية', en: 'To AI study' })} />
    </StepShell>
  )
}
