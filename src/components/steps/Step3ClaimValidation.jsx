import { useState } from 'react'
import { FileUp, Cpu, ShieldCheck, CheckCircle2, Loader2, Send, Lock, ListChecks, Gauge } from 'lucide-react'
import { useApp } from '../../context/AppStateContext.jsx'
import { Card, Badge, Banner, SectionTitle } from '../common/ui.jsx'
import StepShell from '../common/StepShell.jsx'
import StepNav from '../common/StepNav.jsx'
import { LocalContentValidatorWidget } from './StrategicUXEnhancements.jsx'
import { WBS_MATRIX, BOQ_MATRIX } from '../../data/aiFlow.js'
import { fmtSAR } from '../../data/mock.js'

export default function Step3ClaimValidation() {
  const { state, tx, raiseClaim, validateClaim, submitClaim, localContentMet } = useApp()
  const [validating, setValidating] = useState(false)
  const canSubmit = state.claimVerified && localContentMet
  const sar = tx({ ar: 'ر.س', en: 'SAR' })

  const runValidator = () => { setValidating(true); setTimeout(() => { setValidating(false); validateClaim() }, 1200) }

  if (!state.awarded) {
    return (
      <StepShell step={3} title={tx({ ar: 'التحقق ورفع المستخلص', en: 'Claim Validation' })}>
        <Banner tone="warn" icon={Cpu} title={tx({ ar: 'يلزم إتمام الترسية أولًا (الخطوة 2).', en: 'The award must complete first (Step 2).' })} />
        <StepNav hideNext />
      </StepShell>
    )
  }

  return (
    <StepShell
      step={3}
      title={tx({ ar: 'التحقق الذكي ورفع المستخلص', en: 'AI Claim Validation & Submission' })}
      subtitle={tx({ ar: 'بعد تنفيذ الأعمال، يرفع المقاول المستخلص ويتحقق محرّك الامتثال الذكي من مطابقته لـ WBS/BOQ المعتمدة قبل الإرسال إلى «اعتماد».', en: 'After delivery, the contractor raises the claim and the AI compliance engine matches it to the approved WBS/BOQ before submitting to Etimad.' })}
      aside={<Badge tone="info"><Cpu className="h-3.5 w-3.5" /> {tx({ ar: 'المرحلة: التحقق من المستخلص', en: 'Stage: claim validation' })}</Badge>}
    >
      {!state.claimRaised ? (
        <Card className="card-pad">
          <div className="flex flex-col items-center py-6 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-50 text-cyan-600"><FileUp className="h-7 w-7" /></div>
            <h3 className="mt-3 text-lg font-bold text-teal-900">{tx({ ar: 'رفع المستخلص', en: 'Raise the claim' })}</h3>
            <p className="mt-1 max-w-md text-sm text-teal-600">{tx({ ar: 'تم تنفيذ الأعمال وفق جدول المعالم المعتمد. ارفع المستخلص لبدء التحقق الذكي من المطابقة.', en: 'Work was delivered per the approved milestone plan. Raise the claim to start the AI compliance check.' })}</p>
            <button className="btn-primary mt-4" onClick={raiseClaim}><FileUp className="h-4 w-4" /> {tx({ ar: 'رفع المستخلص', en: 'Raise the claim' })}</button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="card-pad">
            <SectionTitle icon={Cpu}>{tx({ ar: 'محرّك التحقق الذكي من الامتثال', en: 'AI compliance validation engine' })}</SectionTitle>
            <p className="text-sm text-teal-600">{tx({ ar: 'يطابق المحرّك بنود المستخلص مع جدول تجزئة الأعمال وجدول الكميات المقفلين.', en: 'The engine matches claim lines to the locked WBS and BOQ.' })}</p>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-line bg-page px-3 py-2 text-center">
                <div className="tnum text-lg font-bold text-teal-900">{WBS_MATRIX.length}</div>
                <div className="text-teal-500">{tx({ ar: 'بنود WBS', en: 'WBS items' })}</div>
              </div>
              <div className="rounded-lg border border-line bg-page px-3 py-2 text-center">
                <div className="tnum text-lg font-bold text-teal-900">{BOQ_MATRIX.length}</div>
                <div className="text-teal-500">{tx({ ar: 'بنود BOQ', en: 'BOQ items' })}</div>
              </div>
            </div>

            {state.claimVerified ? (
              <div className="mt-4 animate-fadeUp">
                <Banner tone="ok" icon={ShieldCheck} title={tx({ ar: 'مستخلص موثّق · مطابقة كاملة 100%', en: 'Verified claim · 100% match' })}>
                  {tx({ ar: 'تطابق المستخلص مع WBS/BOQ المعتمدة. تم قفله بشارة «موثّق».', en: 'The claim matches the approved WBS/BOQ and is locked with a “Verified” badge.' })}
                </Banner>
                <div className="mt-3 flex items-center justify-between rounded-xl border border-ok-100 bg-ok-50 px-4 py-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-ok-600"><Lock className="h-4 w-4" /> {tx({ ar: 'قيمة المستخلص الموثّقة', en: 'Verified claim value' })}</span>
                  <span className="tnum font-bold text-ok-600">{fmtSAR(state.validatedClaim)} {sar}</span>
                </div>
              </div>
            ) : (
              <button className="btn-primary mt-4 w-full" onClick={runValidator} disabled={validating}>
                {validating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Cpu className="h-4 w-4" />}
                {validating ? tx({ ar: 'جارٍ التحقق من المطابقة…', en: 'Checking compliance…' }) : tx({ ar: 'تشغيل محرّك التحقق الذكي', en: 'Run the AI validator' })}
              </button>
            )}
          </Card>

          <LocalContentValidatorWidget
            currentScore={state.localContentScore}
            targetScore={state.targetLocalContentScore}
            claimValue={state.claimValue}
          />
        </div>
      )}

      {state.claimRaised && (
        <Card className="card-pad mt-5">
          <SectionTitle icon={ListChecks}>{tx({ ar: 'جاهزية الإرسال إلى «اعتماد»', en: 'Ready to submit to Etimad' })}</SectionTitle>
          <ul className="space-y-2 text-sm">
            <Ready ok={state.claimVerified} label={tx({ ar: 'مطابقة المستخلص لـ WBS/BOQ (تحقق ذكي)', en: 'Claim matches WBS/BOQ (AI verified)' })} />
            <Ready ok={localContentMet} label={tx({ ar: 'بلوغ نسبة المحتوى المحلي المستهدفة', en: 'Local-content target met' })} />
          </ul>
          {state.claimSubmitted ? (
            <Banner tone="ok" icon={CheckCircle2} title={tx({ ar: 'تم إرسال المستخلص الموثّق إلى «اعتماد».', en: 'Verified claim submitted to Etimad.' })} />
          ) : (
            <button className="btn-primary mt-4" onClick={submitClaim} disabled={!canSubmit}>
              <Send className="h-4 w-4" /> {tx({ ar: 'إرسال المستخلص الموثّق إلى «اعتماد»', en: 'Submit the verified claim to Etimad' })}
            </button>
          )}
        </Card>
      )}

      <StepNav nextDisabled={!state.claimSubmitted} nextLabel={tx({ ar: 'إلى التدقيق الذكي', en: 'To smart audit' })} />
    </StepShell>
  )
}

function Ready({ ok, label }) {
  return (
    <li className="flex items-center gap-2">
      {ok ? <CheckCircle2 className="h-4 w-4 text-ok-500" /> : <Gauge className="h-4 w-4 text-teal-300" />}
      <span className={ok ? 'text-teal-800' : 'text-teal-500'}>{label}</span>
    </li>
  )
}
