import {
  ShieldCheck, Cpu, ListChecks, ThumbsUp, ThumbsDown, FileCheck, Activity, Ban,
  CheckCircle2, WifiOff, Wifi, Camera, TrendingDown,
} from 'lucide-react'
import { useApp } from '../../context/AppStateContext.jsx'
import { Card, Badge, Banner, SectionTitle } from '../common/ui.jsx'
import StepShell from '../common/StepShell.jsx'
import StepNav from '../common/StepNav.jsx'
import { OfflineFieldModeBanner, FeedbackCountdownWidget } from './StrategicUXEnhancements.jsx'
import { fmtSAR } from '../../data/mock.js'

export default function Step4SmartAudit() {
  const { state, tx, generateAudit, auditDecision, auditDone, setOffline, queueOffline } = useApp()
  const canAct = state.role === 'khalid' || state.role === 'owner'
  const decided = state.auditItems.filter((i) => i.status !== 'pending').length
  const rejectedCount = state.auditItems.filter((i) => i.status === 'rejected').length
  const sar = tx({ ar: 'ر.س', en: 'SAR' })

  if (!state.claimSubmitted) {
    return (
      <StepShell step={4} title={tx({ ar: 'التدقيق الذكي', en: 'Smart Audit' })}>
        <Banner tone="warn" icon={Cpu} title={tx({ ar: 'بانتظار إرسال المستخلص الموثّق (الخطوة 3).', en: 'Waiting for the verified claim submission (Step 3).' })} />
        <StepNav hideNext />
      </StepShell>
    )
  }

  return (
    <StepShell
      step={4}
      title={tx({ ar: 'لوحة التدقيق الذكية · خالد', en: 'Smart Audit Dashboard · Khalid' })}
      subtitle={tx({ ar: 'يستعرض المُقيّم المستخلص المُرسَل مع قائمة فحص عشوائية ذكية. كل اعتماد أو رفض يُحدث قيد حركة فنية يعدّل النطاق المعتمد آليًا.', en: 'The inspector reviews the submitted claim with a random AI audit list. Each approval/rejection posts a technical movement entry that auto-adjusts the validated scope.' })}
      aside={<Badge tone="info"><ShieldCheck className="h-3.5 w-3.5" /> {tx({ ar: 'المرحلة: التدقيق', en: 'Stage: audit' })}</Badge>}
    >
      <OfflineFieldModeBanner isOffline={state.isOffline} queueCount={state.offlineQueue} />
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {!state.isOffline ? (
          <button className="btn-outline" onClick={() => setOffline(true)}><WifiOff className="h-4 w-4" /> {tx({ ar: 'محاكاة معاينة ميدانية دون اتصال', en: 'Simulate offline field inspection' })}</button>
        ) : (
          <>
            <button className="btn-soft" onClick={queueOffline}><Camera className="h-4 w-4" /> {tx({ ar: 'التقاط دليل ميداني مشفّر', en: 'Capture encrypted field evidence' })}</button>
            <button className="btn-primary" onClick={() => setOffline(false)}><Wifi className="h-4 w-4" /> {tx({ ar: 'استعادة الاتصال والمزامنة', en: 'Reconnect & sync' })}</button>
          </>
        )}
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <Summary icon={FileCheck} label={tx({ ar: 'النطاق المعتمد (آني)', en: 'Validated scope (live)' })} value={`${fmtSAR(state.validatedClaim)} ${sar}`} tone="teal" />
        <Summary icon={TrendingDown} label={tx({ ar: 'بنود مرفوضة', en: 'Rejected items' })} value={rejectedCount} tone={rejectedCount ? 'bad' : 'ok'} />
        <Summary icon={Activity} label={tx({ ar: 'تقدّم الفحص', en: 'Audit progress' })} value={`${decided}/${state.auditItems.length || 0}`} tone="cyan" />
      </div>

      {!state.auditGenerated ? (
        <Card className="card-pad">
          <div className="flex flex-col items-center py-6 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-50 text-cyan-600"><Cpu className="h-7 w-7" /></div>
            <h3 className="mt-3 text-lg font-bold text-teal-900">{tx({ ar: 'قائمة الفحص العشوائية الذكية', en: 'Random AI audit list' })}</h3>
            <p className="mt-1 max-w-md text-sm text-teal-600">{tx({ ar: 'يولّد المحرّك قائمة فحص عشوائية من بنود التدقيق عالية الأثر ليتحقق منها المُقيّم ميدانيًا.', en: 'The engine draws a random list of high-impact audit items for the inspector to verify in the field.' })}</p>
            <button className="btn-primary mt-4" onClick={generateAudit}><Cpu className="h-4 w-4" /> {tx({ ar: 'توليد قائمة الفحص الذكية', en: 'Generate the AI audit list' })}</button>
          </div>
        </Card>
      ) : (
        <Card className="card-pad">
          <SectionTitle icon={ListChecks} hint={tx({ ar: 'الاعتماد يثبّت النطاق، والرفض يحذف قيمة البند من المستخلص (قيد حركة فنية).', en: 'Approve fixes scope; reject removes the item value via a movement entry.' })}>
            {tx({ ar: 'قائمة الفحص العشوائية الذكية', en: 'Random AI audit list' })}
          </SectionTitle>
          <ul className="space-y-2">
            {state.auditItems.map((it) => (
              <li key={it.id} className={`rounded-xl border p-3.5 ${it.status === 'rejected' ? 'border-bad-100 bg-bad-50' : it.status === 'approved' ? 'border-ok-100 bg-ok-50' : 'border-line bg-white'}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-teal-900">{tx({ ar: it.labelAr, en: it.labelEn })}</div>
                    <div className="mt-0.5 text-xs text-teal-500">{tx({ ar: 'قيمة البند ضمن النطاق', en: 'Item value in scope' })}: {fmtSAR(it.scopeValue)} {sar}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {it.status !== 'pending' && (
                      <Badge tone={it.status === 'approved' ? 'ok' : 'bad'}>{it.status === 'approved' ? tx({ ar: 'معتمد', en: 'Approved' }) : tx({ ar: 'مرفوض', en: 'Rejected' })}</Badge>
                    )}
                    <button className={`btn px-3 py-1.5 text-xs ${it.status === 'approved' ? 'bg-ok-500 text-white' : 'border border-line bg-white text-teal-700 hover:bg-page'}`} disabled={!canAct} onClick={() => auditDecision(it.id, 'approved')}>
                      <ThumbsUp className="h-3.5 w-3.5" /> {tx({ ar: 'اعتماد', en: 'Approve' })}
                    </button>
                    <button className={`btn px-3 py-1.5 text-xs ${it.status === 'rejected' ? 'bg-bad-500 text-white' : 'border border-line bg-white text-teal-700 hover:bg-page'}`} disabled={!canAct} onClick={() => auditDecision(it.id, 'rejected')}>
                      <ThumbsDown className="h-3.5 w-3.5" /> {tx({ ar: 'رفض', en: 'Reject' })}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {!canAct && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-teal-600"><Ban className="h-3.5 w-3.5" /> {tx({ ar: 'بدّل الدور إلى «خالد» أو «الجهة» للبتّ في بنود الفحص.', en: 'Switch role to “Khalid” or “Owner” to decide audit items.' })}</p>
          )}
          {auditDone && (
            <Banner tone="ok" icon={CheckCircle2} title={tx({ ar: 'اكتمل التدقيق الذكي', en: 'Smart audit complete' })}>
              {tx({ ar: 'تم البتّ في جميع بنود الفحص — النطاق المعتمد جاهز لمرحلة التمويل.', en: 'All audit items decided — the validated scope is ready for financing.' })}
            </Banner>
          )}
        </Card>
      )}

      {state.isRejected && (
        <div className="mt-5">
          <FeedbackCountdownWidget isRejected={state.isRejected} rejectionDate={state.rejectedAt} />
        </div>
      )}

      <StepNav nextDisabled={!auditDone} nextLabel={tx({ ar: 'إلى التمويل', en: 'To financing' })} />
    </StepShell>
  )
}

function Summary({ icon: Icon, label, value, tone }) {
  const tones = { teal: 'text-teal-900', bad: 'text-bad-600', ok: 'text-ok-600', cyan: 'text-cyan-600' }
  return (
    <Card className="card-pad">
      <div className="flex items-start justify-between">
        <span className="label">{label}</span>
        <Icon className="h-5 w-5 text-teal-400" />
      </div>
      <div className={`mt-2 text-xl font-bold tabular-nums ${tones[tone]}`}>{value}</div>
    </Card>
  )
}
