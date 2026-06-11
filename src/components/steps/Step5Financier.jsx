import { Banknote, Coins, ShieldAlert, Gauge, Cpu, CheckCircle2, HandCoins, TrendingUp, Clock } from 'lucide-react'
import { useApp } from '../../context/AppStateContext.jsx'
import { Card, Badge, Banner, SectionTitle, ProgressBar } from '../common/ui.jsx'
import StepShell from '../common/StepShell.jsx'
import StepNav from '../common/StepNav.jsx'
import ActivityHistory from '../common/ActivityHistory.jsx'
import { FrameworkTaskPortfolio } from './StrategicUXEnhancements.jsx'
import { fmtSAR } from '../../data/mock.js'

export default function Step5Financier() {
  const { state, tx, requestFinancing, approveFund, changeMerged, changeValue, contractTotal, paymentHeldByChange } = useApp()
  const isFinancier = state.role === 'financier'
  const isSara = state.role === 'sara'
  const sar = tx({ ar: 'ر.س', en: 'SAR' })

  const rejected = state.auditItems.filter((i) => i.status === 'rejected').length
  const riskTone = state.riskFactor <= 25 ? 'ok' : state.riskFactor <= 45 ? 'warn' : 'bad'
  const fundable = Math.round(state.validatedClaim * 0.9)

  if (!state.auditDone && !state.claimSubmitted) {
    return (
      <StepShell step={5} title={tx({ ar: 'التمويل ومحرك الإيراد', en: 'Financing & Revenue' })}>
        <Banner tone="warn" icon={Cpu} title={tx({ ar: 'يلزم إتمام التدقيق الذكي أولًا (الخطوة 4).', en: 'Smart audit must complete first (Step 4).' })} />
        <StepNav hideNext />
      </StepShell>
    )
  }

  return (
    <StepShell
      step={5}
      title={tx({ ar: 'لوحة المموّل ومحرّك الإيراد', en: 'Financier & Movement Revenue Engine' })}
      subtitle={tx({ ar: 'يطلب المقاول تمويلًا فوريًا على المستخلص المعتمد من المُقيّم، ويراجع المموّل الطلب مع تحليل المخاطر، ثم يعتمد ويموّل ليولّد المحرّك إيرادًا فعليًا.', en: 'The contractor requests financing on the inspector-approved claim; the financier reviews with risk analysis, then approves & funds — generating real revenue.' })}
      aside={<Badge tone={state.fundApproved ? 'ok' : 'info'}><Banknote className="h-3.5 w-3.5" /> {state.fundApproved ? tx({ ar: 'مُموّل', en: 'Funded' }) : tx({ ar: 'المرحلة: التمويل', en: 'Stage: financing' })}</Badge>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Coins} label={tx({ ar: 'النطاق المعتمد', en: 'Validated scope' })} value={`${fmtSAR(state.validatedClaim)} ${sar}`} tone="teal" small />
        <Kpi icon={HandCoins} label={tx({ ar: 'قابل للتمويل (90%)', en: 'Fundable (90%)' })} value={`${fmtSAR(fundable)} ${sar}`} tone="cyan" small />
        <Kpi icon={ShieldAlert} label={tx({ ar: 'عامل المخاطر', en: 'Risk factor' })} value={`${state.riskFactor}%`} tone={riskTone} />
        <Kpi icon={TrendingUp} label={tx({ ar: 'إيراد مُتحقّق', en: 'Realized revenue' })} value={`${fmtSAR(state.generatedRevenue)} ${sar}`} tone="ok" small />
      </div>

      {/* Change-request reflections: updated contract total + payment hold */}
      {paymentHeldByChange && (
        <div className="mt-4">
          <Banner tone="warn" icon={Cpu} title={tx({ ar: 'الدفع متوقّف مؤقتًا حتى يُحسم طلب التغيير.', en: 'Payment is paused until the change request is resolved.' })} />
        </div>
      )}
      {changeMerged && (
        <div className="mt-4">
          <Banner tone="ok" icon={CheckCircle2} title={tx({ ar: `قيمة العقد المحدّثة: ${fmtSAR(contractTotal)} ر.س`, en: `Updated contract value: ${fmtSAR(contractTotal)} SAR` })}>
            {tx({ ar: `شامل تغييرًا معتمدًا بقيمة ${fmtSAR(changeValue)} ر.س — واستؤنف الدفع على الخطة المحدّثة.`, en: `Includes an approved change of ${fmtSAR(changeValue)} SAR — payment resumed on the updated plan.` })}
          </Banner>
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <Card className="card-pad">
            <SectionTitle icon={Banknote}>{tx({ ar: 'طلب التمويل على المستخلص المعتمد', en: 'Financing request on the approved claim' })}</SectionTitle>

            {!state.financingRequested ? (
              <div className="rounded-xl border border-dashed border-line bg-white py-6 text-center">
                <p className="text-sm text-teal-600">{tx({ ar: 'لم يُقدَّم طلب تمويل بعد على هذا المستخلص.', en: 'No financing request has been submitted for this claim yet.' })}</p>
                <button className="btn-primary mt-3" onClick={requestFinancing} disabled={!isSara}>
                  <HandCoins className="h-4 w-4" /> {tx({ ar: 'طلب تمويل فوري', en: 'Request instant financing' })}
                </button>
                {!isSara && <p className="mt-2 text-xs text-teal-600">{tx({ ar: 'بدّل الدور إلى «سارة» لتقديم طلب التمويل.', en: 'Switch role to “Sara” to submit the request.' })}</p>}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between rounded-xl border border-line bg-page px-4 py-3">
                  <span className="text-sm text-teal-700">{tx({ ar: 'مبلغ التمويل المطلوب (90% من النطاق المعتمد)', en: 'Requested amount (90% of validated scope)' })}</span>
                  <span className="tnum font-bold text-teal-900">{fmtSAR(fundable)} {sar}</span>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-teal-700"><Gauge className="h-4 w-4" /> {tx({ ar: 'تحليل المخاطر الذكي وعنق الزجاجة', en: 'AI risk & bottleneck analysis' })}</span>
                    <Badge tone={riskTone}>{state.riskFactor <= 25 ? tx({ ar: 'مخاطر منخفضة', en: 'Low risk' }) : state.riskFactor <= 45 ? tx({ ar: 'مخاطر متوسطة', en: 'Medium risk' }) : tx({ ar: 'مخاطر مرتفعة', en: 'High risk' })}</Badge>
                  </div>
                  <ProgressBar value={state.riskFactor} tone={riskTone} />
                  <ul className="mt-3 space-y-1.5 text-sm text-teal-700">
                    <li className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${rejected ? 'bg-bad-500' : 'bg-ok-500'}`} /> {tx({ ar: 'بنود تدقيق مرفوضة', en: 'Rejected audit items' })}: {rejected}</li>
                    <li className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${state.delayedProjects ? 'bg-warn-500' : 'bg-ok-500'}`} /> {tx({ ar: 'مشاريع متعثّرة في المحفظة', en: 'Delayed projects in portfolio' })}: {state.delayedProjects}</li>
                    <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-500" /> {tx({ ar: 'رأس مال عالق ضمن الاتفاقية الإطارية', en: 'Trapped capital within the framework agreement' })}</li>
                  </ul>
                </div>

                {state.fundApproved ? (
                  <Banner tone="ok" icon={CheckCircle2} title={tx({ ar: 'تم الاعتماد والتمويل — توليد إيراد فعلي', en: 'Approved & funded — real revenue generated' })}>
                    {tx({ ar: 'حرّك محرّك الحركة المستحقات إلى إيراد مُتحقّق وحدّث التدفّق النقدي للنظام لحظيًا.', en: 'The Movement Engine converted receivables into realized revenue and updated system cash-flow in real time.' })}
                  </Banner>
                ) : (
                  <button className="btn-ok mt-4" onClick={approveFund} disabled={!isFinancier}>
                    <Banknote className="h-4 w-4" /> {tx({ ar: 'اعتماد وتمويل', en: 'Approve & Fund' })}
                  </button>
                )}
                {!state.fundApproved && !isFinancier && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-teal-600"><Clock className="h-3.5 w-3.5" /> {tx({ ar: 'بدّل الدور إلى «المموّل» لاعتماد التمويل.', en: 'Switch role to “Financier” to approve funding.' })}</p>
                )}
              </>
            )}
          </Card>

          <FrameworkTaskPortfolio openOrders={state.openWorkOrders} />
        </div>

        <Card className="card-pad">
          <ActivityHistory compact />
        </Card>
      </div>

      <StepNav hideNext />
    </StepShell>
  )
}

function Kpi({ icon: Icon, label, value, tone, small }) {
  const tones = { teal: 'text-teal-900', cyan: 'text-cyan-600', ok: 'text-ok-600', warn: 'text-warn-600', bad: 'text-bad-600' }
  return (
    <Card className="card-pad">
      <div className="flex items-start justify-between">
        <span className="label">{label}</span>
        <Icon className="h-5 w-5 text-teal-400" />
      </div>
      <div className={`mt-2 font-bold tabular-nums ${tones[tone]} ${small ? 'text-lg' : 'text-2xl'}`}>{value}</div>
    </Card>
  )
}
