import {
  CheckCircle2, Cpu, ShieldAlert, TrendingUp, HardHat, ShieldCheck, Gauge, Banknote,
  ArrowLeft, ArrowRight, Filter, UserCheck, BarChart3, AlertCircle, LayoutDashboard, Recycle, X,
} from 'lucide-react'
import { useApp } from '../../context/AppStateContext.jsx'
import { Card, Badge, Banner, ProgressBar, SectionTitle } from '../common/ui.jsx'
import { PROJECTS, WBS_MATRIX } from '../../data/aiFlow.js'
import { fmtSAR } from '../../data/mock.js'

const STATUS_TONE = { completed: 'ok', active: 'cyan', delayed: 'bad' }
const PAY_TONE = { paid: 'ok', partial: 'cyan', pending: 'warn', held: 'bad' }

const QUICK_ROLES = [
  { id: 'sara', step: 1, name: { ar: 'سارة', en: 'Sara' }, icon: HardHat, color: 'cyan' },
  { id: 'khalid', step: 4, name: { ar: 'خالد', en: 'Khalid' }, icon: ShieldCheck, color: 'teal' },
  { id: 'financier', step: 5, name: { ar: 'الممول', en: 'Financier' }, icon: Banknote, color: 'ok' },
]
const ROLE_CARDS = [
  { id: 'sara', icon: HardHat, color: 'cyan', step: 1, name: { ar: 'سارة — المقاول', en: 'Sara — Contractor' }, sub: { ar: 'المطابقة والتسعير ورفع المستخلص', en: 'Matching, pricing & raising the claim' } },
  { id: 'khalid', icon: ShieldCheck, color: 'teal', step: 4, name: { ar: 'خالد — المُقيّم', en: 'Khalid — Inspector' }, sub: { ar: 'التدقيق الذكي وقيد الحركة الفنية', en: 'Smart audit & technical movement entries' } },
  { id: 'owner', icon: Gauge, color: 'warn', step: 2, name: { ar: 'الجهة — المالك', en: 'Owner — Authority' }, sub: { ar: 'الترسية وحوكمة التنفيذ', en: 'Award & execution governance' } },
  { id: 'financier', icon: Banknote, color: 'ok', step: 5, name: { ar: 'المموّل — التمويل', en: 'Financier — Funding' }, sub: { ar: 'تحليل المخاطر ومحرّك الإيراد', en: 'Risk analysis & the revenue engine' } },
]
const wbsForPhase = (phase) => WBS_MATRIX[Math.min(WBS_MATRIX.length - 1, Math.max(0, phase - 1))]

export default function ContractorDashboard() {
  const { state, lang, t, tx, setProjectFilter, setRole, enterJourney, localizeMaterial } = useApp()
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const Enter = lang === 'ar' ? ArrowLeft : ArrowRight
  const selected = PROJECTS.find((p) => p.id === state.selectedProjectFilter) || null
  const isAgg = !selected

  const avgCompletion = Math.round(PROJECTS.reduce((a, p) => a + p.progress, 0) / PROJECTS.length)
  const paidCount = PROJECTS.filter((p) => p.paymentKey === 'paid').length
  const pendingCount = PROJECTS.length - paidCount
  const completion = isAgg ? avgCompletion : selected.progress
  const wbs = selected ? wbsForPhase(selected.phase) : null
  const wbsName = wbs ? tx({ ar: wbs.nameAr, en: wbs.nameEn }) : ''

  const enterAs = (roleId, step) => { setRole(roleId); enterJourney(step) }

  return (
    <div className="animate-fadeUp space-y-6" dir={dir}>
      {/* Identity header */}
      <Card className="overflow-hidden">
        <div className="bg-teal-900 p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">مسارات التنفيذ — Masarat Al-Tanfeeth</h1>
              <p className="mt-1 text-sm text-cyan-100">
                {tx({ ar: 'منصة تقود رحلة المقاول من ترسية أمر العمل حتى الدفع المتحقّق، عبر تقييم موثّق وحوكمة غير قابلة للتعديل.', en: 'A platform that drives the contractor’s journey from work-order award to verified payment, through trusted valuation and tamper-proof governance.' })}
              </p>
            </div>
            <Badge tone="info" className="bg-white/10 text-cyan-100">{tx({ ar: 'الاتفاقية الإطارية', en: 'Framework Agreement' })} · SIDF #4000003855</Badge>
          </div>
        </div>
      </Card>

      {/* ── MASTER–DETAIL ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* slicer sidebar */}
        <aside className="lg:col-span-1">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-sm font-bold text-teal-900"><Filter className="h-4 w-4 text-cyan-500" /> {t('dash_projects')}</h3>
            {selected && (
              <button onClick={() => setProjectFilter(null)} className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:underline">
                <X className="h-3 w-3" /> {t('dash_clear_filter')}
              </button>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {PROJECTS.map((p) => {
              const active = selected?.id === p.id
              const tone = STATUS_TONE[p.statusKey]
              return (
                <button
                  key={p.id}
                  onClick={() => setProjectFilter(p.id)}
                  className={`rounded-xl border bg-white p-3 text-start transition-all duration-300 ${active ? 'border-cyan-500 ring-2 ring-cyan-100 shadow-soft' : 'border-line hover:bg-page'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-semibold text-teal-900">{tx(p.name)}</span>
                    <span className={`chip px-2 py-0.5 text-[10px] ${tone === 'bad' ? 'bg-bad-50 text-bad-600' : tone === 'ok' ? 'bg-ok-50 text-ok-600' : 'bg-cyan-50 text-cyan-600'}`}>{tx(p.status)}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <div className={`h-full rounded-full transition-all duration-500 ${p.statusKey === 'delayed' ? 'bg-bad-500' : p.progress >= 90 ? 'bg-ok-500' : 'bg-cyan-500'}`} style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="mt-1 block font-mono text-[10px] text-teal-600">{p.progress}%</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* main dashboard */}
        <div className="space-y-6 lg:col-span-3">
          <Card key={selected?.id || 'agg'} className="card-pad animate-fadeUp transition-all duration-300">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="flex items-center gap-2 text-base font-bold text-teal-900">
                  <LayoutDashboard className="h-5 w-5 text-cyan-500" />
                  {isAgg ? t('dash_agg_title') : `${t('dash_sel_title')} · ${tx(selected.name)}`}
                </h2>
                <p className="mt-0.5 text-xs text-teal-600">{isAgg ? t('dash_agg_sub') : t('dash_sel_sub')}</p>
              </div>
              {isAgg ? (
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone="ok">{state.completedProjects} {tx({ ar: 'مكتملة', en: 'completed' })}</Badge>
                  <Badge tone="cyan">{state.activeProjects} {tx({ ar: 'نشطة', en: 'active' })}</Badge>
                  <Badge tone="bad">{state.delayedProjects} {tx({ ar: 'متعثّرة', en: 'delayed' })}</Badge>
                </div>
              ) : (
                <Badge tone={STATUS_TONE[selected.statusKey]}>{tx(selected.status)}</Badge>
              )}
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-page p-4">
                <span className="label">{isAgg ? t('dash_avg_completion') : t('dash_completion')}</span>
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-mono text-xl font-bold text-teal-900">{completion}%</span>
                  <div className="flex-1"><ProgressBar value={completion} tone={selected?.statusKey === 'delayed' ? 'bad' : completion >= 90 ? 'ok' : 'cyan'} /></div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-page p-4">
                <div>
                  <span className="label">{t('dash_payment_state')}</span>
                  <div className="mt-1 text-sm font-bold text-teal-900">
                    {isAgg
                      ? tx({ ar: `${paidCount} معتمدة · ${pendingCount} قيد التدقيق/الصرف`, en: `${paidCount} approved · ${pendingCount} under review/disbursement` })
                      : tx(selected.paymentState)}
                  </div>
                </div>
                <Badge tone={isAgg ? 'cyan' : PAY_TONE[selected.paymentKey]}>{isAgg ? tx({ ar: 'مستقرة جزئيًا', en: 'Partially stable' }) : tx(selected.paymentLabel)}</Badge>
              </div>
            </div>

            {/* Bottleneck */}
            <div className="mt-4">
              {isAgg ? (
                state.delayedProjects > 0 ? (
                  <Banner tone="warn" icon={AlertCircle} title={t('sys_bottleneck_title')}>
                    {tx({ ar: `يوجد ${state.delayedProjects} مشروع متعثّر يستنزف رأس المال العالق. اختر مشروعًا من القائمة لتحديد موضع التسرّب بدقة على شجرة WBS.`, en: `${state.delayedProjects} delayed project is draining trapped capital. Select a project to pinpoint the value leak on the WBS tree.` })}
                  </Banner>
                ) : (
                  <Banner tone="ok" icon={CheckCircle2} title={t('sys_bottleneck_ok')} />
                )
              ) : selected.statusKey === 'delayed' ? (
                <Banner tone="bad" icon={ShieldAlert} title={`${tx({ ar: 'عنق الزجاجة (وين التأخير)', en: 'Bottleneck (where’s the delay)' })} · ${wbs.code} — ${wbsName}`}>
                  {tx(selected.bottleneck)}
                </Banner>
              ) : selected.progress === 100 ? (
                <Banner tone="ok" icon={CheckCircle2} title={tx({ ar: 'مكتمل ومدفوع', en: 'Completed & paid' })}>{tx(selected.bottleneck)}</Banner>
              ) : (
                <Banner tone="warn" icon={AlertCircle} title={`${tx({ ar: 'موضع التسرّب', en: 'Value-leak point' })} · ${wbs.code} — ${wbsName} (${tx({ ar: 'المرحلة', en: 'phase' })} ${selected.phase})`}>
                  {tx(selected.bottleneck)}
                </Banner>
              )}
            </div>

            {/* Quick role navigation */}
            <div className="mt-5 border-t border-line pt-4">
              <div className="label mb-2 flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5" /> {t('dash_quick_roles')}</div>
              <div className="flex flex-wrap gap-2">
                {QUICK_ROLES.map((r) => {
                  const Icon = r.icon
                  const tones = { cyan: 'hover:border-cyan-300 hover:bg-cyan-50 text-cyan-700', teal: 'hover:border-teal-400 hover:bg-page text-teal-700', ok: 'hover:border-ok-100 hover:bg-ok-50 text-ok-600' }
                  return (
                    <button key={r.id} onClick={() => enterAs(r.id, r.step)} className={`inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-sm font-semibold transition-all duration-300 ${tones[r.color]}`}>
                      <Icon className="h-4 w-4" /> {t('dash_enter_as')} {tx(r.name)} <Enter className="h-3.5 w-3.5" />
                    </button>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* AI Insights */}
          <div>
            <SectionTitle icon={Cpu} hint={t('insights_sub')}>{t('insights_title')}</SectionTitle>
            <div className="grid gap-4 md:grid-cols-3">
              <Insight icon={ShieldAlert} color="bad" title={tx({ ar: 'مخاطر التدفق النقدي', en: 'Cash-flow risk' })}>
                {selected?.statusKey === 'delayed' || state.isRejected
                  ? tx({ ar: 'تنبيه: تبقّى ضمن نافذة الـ 7 أيام لإغلاق النزاع الفني أو رفع المحتوى المحلي قبل بدء احتساب غرامة تأخير يومية تقديرية بقيمة 2,500 ر.س على الدفعة المحتجزة.', en: 'Alert: time remains inside the 7-day window to close the technical dispute or raise local content before a daily late-penalty (≈ 2,500 SAR) starts accruing on the held payment.' })
                  : tx({ ar: 'مؤشر أمان: جميع المستخلصات داخل المهلة النظامية ولا يوجد خطر غرامات تعاقدية حرج حاليًا.', en: 'Safety indicator: all claims are within the statutory window — no critical contractual-penalty risk right now.' })}
              </Insight>

              <Insight icon={TrendingUp} color="cyan" title={tx({ ar: 'القائمة الإلزامية البديلة', en: 'Mandatory-list optimization' })}>
                {tx({ ar: `رصد النظام مصنعًا وطنيًا معتمدًا بديلًا للمواد غير الممتثلة لرفع نسبة المحتوى المحلي من ${state.localContentScore}% نحو المستهدف ${state.targetLocalContentScore}% وفكّ تعليق الدفع فورًا.`, en: `The system found a certified Saudi factory substitute for non-compliant materials to lift local content from ${state.localContentScore}% toward the ${state.targetLocalContentScore}% target and release the payment hold instantly.` })}
                {state.localContentScore < state.targetLocalContentScore && (
                  <button onClick={() => { const m = state.localMaterials.find((x) => !x.isLocal); if (m) localizeMaterial(m.id) }} className="btn-soft mt-2 px-3 py-1.5 text-xs">
                    <Recycle className="h-3.5 w-3.5" /> {tx({ ar: 'تطبيق البديل الوطني', en: 'Apply local substitute' })}
                  </button>
                )}
              </Insight>

              <Insight icon={LayoutDashboard} color="ok" title={tx({ ar: 'مؤشر جاهزية التمويل', en: 'Financing-readiness score' })}>
                {state.claimVerified && state.localContentScore >= state.targetLocalContentScore && state.riskFactor <= 25
                  ? tx({ ar: 'بياناتك نظيفة: مطابقة المستخلص للـ WBS 100% ومحتوى محلي ممتثل — الطلب مؤهّل لشارة «مخاطر منخفضة» والقبول الفوري لدى الممول.', en: 'Your data is clean: 100% WBS match and compliant local content — eligible for a “Low Risk” badge and instant financier acceptance.' })
                  : tx({ ar: 'لرفع الجاهزية: أكمل التحقق الذكي من المستخلص، وبلوغ المحتوى المحلي المستهدف، وإغلاق بنود الفحص لخفض عامل المخاطر.', en: 'To improve readiness: complete the AI claim validation, meet the local-content target, and close audit items to lower the risk factor.' })}
              </Insight>
            </div>
          </div>
        </div>
      </div>

      {/* Role entry */}
      <div>
        <SectionTitle icon={Cpu} hint={t('start_from_role_sub')}>{t('start_from_role')}</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLE_CARDS.map((r) => {
            const Icon = r.icon
            const tones = { cyan: 'text-cyan-600 bg-cyan-50', teal: 'text-teal-700 bg-page', warn: 'text-warn-600 bg-warn-50', ok: 'text-ok-600 bg-ok-50' }
            return (
              <button key={r.id} onClick={() => enterAs(r.id, r.step)} className="card card-pad text-start transition-all duration-300 hover:shadow-lift">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${tones[r.color]}`}><Icon className="h-5 w-5" /></div>
                <div className="mt-3 font-bold text-teal-900">{tx(r.name)}</div>
                <div className="mt-0.5 text-xs text-teal-600">{tx(r.sub)}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cyan-600">
                  {t('dash_enter_as')} {tx(r.name).split('—')[0].trim()} <Enter className="h-4 w-4" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <button className="btn-primary px-6 py-3 text-base" onClick={() => enterAs('sara', 1)}>
          <HardHat className="h-5 w-5" /> {t('start_journey_sara')}
        </button>
      </div>
    </div>
  )
}

function Insight({ icon: Icon, color, title, children }) {
  const tones = { bad: 'text-bad-500', cyan: 'text-cyan-600', ok: 'text-ok-500' }
  return (
    <Card className="card-pad transition-all duration-300">
      <div className={`mb-2 flex items-center gap-2 ${tones[color]}`}>
        <Icon className="h-4 w-4" />
        <h4 className="text-sm font-bold">{title}</h4>
      </div>
      <div className="text-xs leading-6 text-teal-800">{children}</div>
    </Card>
  )
}
