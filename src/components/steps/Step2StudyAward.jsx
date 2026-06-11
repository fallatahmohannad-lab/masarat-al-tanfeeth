import { useState } from 'react'
import {
  Cpu, Lock, Layers, Table2, UploadCloud, RefreshCw, Gavel, CheckCircle2, Loader2, FileCheck,
} from 'lucide-react'
import { useApp } from '../../context/AppStateContext.jsx'
import { Card, Badge, Banner, SectionTitle } from '../common/ui.jsx'
import StepShell from '../common/StepShell.jsx'
import StepNav from '../common/StepNav.jsx'
import { WBS_MATRIX, BOQ_MATRIX } from '../../data/aiFlow.js'
import { fmtSAR } from '../../data/mock.js'

export default function Step2StudyAward() {
  const { state, tx, generateStudy, simulateAward, changeMerged } = useApp()
  const [running, setRunning] = useState(false)
  const [awarding, setAwarding] = useState(false)
  const boqTotal = BOQ_MATRIX.reduce((s, b) => s + b.qty * b.rate, 0)
  const sar = tx({ ar: 'ر.س', en: 'SAR' })

  const runEngine = () => { setRunning(true); setTimeout(() => { setRunning(false); generateStudy() }, 1300) }
  const award = () => { setAwarding(true); setTimeout(() => { setAwarding(false); simulateAward() }, 1100) }

  if (!state.bookletBought) {
    return (
      <StepShell step={2} title={tx({ ar: 'الدراسة الذكية والترسية', en: 'AI Study & Award' })}>
        <Banner tone="warn" icon={Cpu} title={tx({ ar: 'اشترِ كراسة المنافسة أولًا (الخطوة 1).', en: 'Buy the RFP booklet first (Step 1).' })} />
        <StepNav hideNext />
      </StepShell>
    )
  }

  return (
    <StepShell
      step={2}
      title={tx({ ar: 'الدراسة الذكية والترسية', en: 'AI Study & Award' })}
      subtitle={tx({ ar: 'يولّد المحرّك الذكي دراسة فنية ومالية مقفلة (WBS وBOQ) جاهزة للرفع إلى «اعتماد» والمزامنة مع أنظمة ERP، ثم انتظار الترسية.', en: 'The AI engine generates a locked technical & financial study (WBS/BOQ) ready to upload to Etimad and sync with ERP, then awaits the award.' })}
      aside={<Badge tone="info"><Cpu className="h-3.5 w-3.5" /> {tx({ ar: `المرحلة: ${state.awarded ? 'الترسية' : 'توليد الدراسة'}`, en: state.awarded ? 'Stage: awarded' : 'Stage: study generation' })}</Badge>}
    >
      {!state.studyGenerated ? (
        <Card className="card-pad">
          <div className="flex flex-col items-center py-6 text-center">
            <div className={`grid h-16 w-16 place-items-center rounded-2xl ${running ? 'bg-cyan-50 text-cyan-600 animate-pop' : 'bg-page text-teal-500'}`}>
              {running ? <Loader2 className="h-8 w-8 animate-spin" /> : <Cpu className="h-8 w-8" />}
            </div>
            <h3 className="mt-4 text-lg font-bold text-teal-900">{tx({ ar: 'محاكاة محرّك الذكاء الاصطناعي', en: 'AI engine simulation' })}</h3>
            <p className="mt-1 max-w-md text-sm text-teal-600">
              {tx({ ar: 'يحلّل المحرّك الكراسة ويولّد جدول تجزئة الأعمال (WBS) وجدول الكميات (BOQ) ودراسة فنية ومالية مقفلة لا تقبل التعديل، جاهزة للرفع والمزامنة.', en: 'The engine analyses the booklet and generates the WBS, the BOQ, and a locked, tamper-proof technical & financial study ready to upload and sync.' })}
            </p>
            <button className="btn-primary mt-5" onClick={runEngine} disabled={running}>
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Cpu className="h-4 w-4" />}
              {running ? tx({ ar: 'جارٍ التوليد…', en: 'Generating…' }) : tx({ ar: 'تشغيل محرّك توليد الدراسة', en: 'Run the study-generation engine' })}
            </button>
          </div>
        </Card>
      ) : (
        <div className="space-y-5">
          <Banner tone="ok" icon={Lock} title={tx({ ar: 'تم توليد الدراسة الفنية والمالية المقفلة', en: 'Locked technical & financial study generated' })}>
            {tx({ ar: 'الدراسة مقفلة وغير قابلة للتعديل — جاهزة للرفع إلى «اعتماد» والمزامنة مع أنظمة ERP.', en: 'The study is locked and tamper-proof — ready to upload to Etimad and sync with ERP.' })}
          </Banner>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="card-pad">
              <div className="flex items-center justify-between">
                <SectionTitle icon={Layers}>{tx({ ar: 'جدول تجزئة الأعمال (WBS)', en: 'Work Breakdown Structure (WBS)' })}</SectionTitle>
                <Badge tone="ok"><Lock className="h-3.5 w-3.5" /> {tx({ ar: 'مقفل', en: 'Locked' })}</Badge>
              </div>
              <ul className="space-y-1.5">
                {WBS_MATRIX.map((w) => (
                  <li key={w.code} className="flex items-center justify-between rounded-lg border border-line bg-page px-3 py-2 text-sm">
                    <span className="flex items-center gap-2 text-teal-800"><span className="font-mono text-xs text-cyan-600">{w.code}</span> {tx({ ar: w.nameAr, en: w.nameEn })}</span>
                    <Badge tone="info">{w.weight}%</Badge>
                  </li>
                ))}
                {changeMerged && (
                  <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-ok-100 bg-ok-50 px-3 py-2 text-sm">
                    <span className="flex items-center gap-2 text-teal-800">
                      <span className="font-mono text-xs text-ok-600">+</span>
                      {state.change.title}
                      <span className="text-xs text-ok-600">({tx({ ar: 'مُضاف بطلب تغيير معتمد', en: 'added by approved change' })})</span>
                    </span>
                    <Badge tone="ok">{fmtSAR(state.change.price)} {tx({ ar: 'ر.س', en: 'SAR' })}</Badge>
                  </li>
                )}
              </ul>
            </Card>

            <Card className="card-pad">
              <div className="flex items-center justify-between">
                <SectionTitle icon={Table2}>{tx({ ar: 'جدول الكميات (BOQ)', en: 'Bill of Quantities (BOQ)' })}</SectionTitle>
                <Badge tone="ok"><Lock className="h-3.5 w-3.5" /> {tx({ ar: 'مقفل', en: 'Locked' })}</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-xs font-semibold uppercase text-teal-400">
                      <th className="p-2 text-start">{tx({ ar: 'البند', en: 'Item' })}</th>
                      <th className="p-2 text-end">{tx({ ar: 'الكمية', en: 'Qty' })}</th>
                      <th className="p-2 text-end">{tx({ ar: 'السعر', en: 'Rate' })}</th>
                      <th className="p-2 text-end">{tx({ ar: 'الإجمالي', en: 'Total' })}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {BOQ_MATRIX.map((b) => (
                      <tr key={b.code}>
                        <td className="p-2 text-teal-800">{tx({ ar: b.nameAr, en: b.nameEn })}</td>
                        <td className="p-2 text-end tnum text-teal-600">{fmtSAR(b.qty)} {b.unitAr}</td>
                        <td className="p-2 text-end tnum text-teal-600">{fmtSAR(b.rate)}</td>
                        <td className="p-2 text-end tnum font-semibold text-teal-900">{fmtSAR(b.qty * b.rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-line font-bold">
                      <td className="p-2 text-teal-700" colSpan={3}>{tx({ ar: 'إجمالي جدول الكميات', en: 'BOQ total' })}</td>
                      <td className="p-2 text-end tnum text-teal-900">{fmtSAR(boqTotal)} {sar}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          </div>

          <Card className="card-pad">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-xl border border-line bg-page px-4 py-3 text-sm text-teal-800">
                <UploadCloud className="h-4 w-4 text-cyan-500" /> {tx({ ar: 'تم الرفع إلى منصة «اعتماد»', en: 'Uploaded to the Etimad platform' })}
                <CheckCircle2 className="ms-auto h-4 w-4 text-ok-500" />
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-line bg-page px-4 py-3 text-sm text-teal-800">
                <RefreshCw className="h-4 w-4 text-cyan-500" /> {tx({ ar: 'مزامنة مع أنظمة ERP للمقاول', en: 'Synced with the contractor ERP' })}
                <CheckCircle2 className="ms-auto h-4 w-4 text-ok-500" />
              </div>
            </div>

            <div className="mt-4">
              {state.awarded ? (
                <Banner tone="ok" icon={Gavel} title={tx({ ar: 'تمت الترسية على المقاول', en: 'Awarded to the contractor' })}>
                  {tx({ ar: 'صدر أمر العمل عبر «اعتماد» — انتقل إلى رفع المستخلص بعد التنفيذ.', en: 'The work order was issued via Etimad — proceed to raise the claim after delivery.' })}
                </Banner>
              ) : (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-white py-6 text-center">
                  <FileCheck className="h-7 w-7 text-teal-400" />
                  <div className="text-sm text-teal-600">{tx({ ar: 'بانتظار محاكاة الترسية من الجهة المالكة.', en: 'Awaiting the award simulation from the owner.' })}</div>
                  <button className="btn-primary mt-1" onClick={award} disabled={awarding}>
                    {awarding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gavel className="h-4 w-4" />}
                    {awarding ? tx({ ar: 'جارٍ الترسية…', en: 'Awarding…' }) : tx({ ar: 'محاكاة الترسية', en: 'Simulate award' })}
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      <StepNav nextDisabled={!state.awarded} nextLabel={tx({ ar: 'إلى رفع المستخلص', en: 'To claim' })} />
    </StepShell>
  )
}
