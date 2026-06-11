import { useState } from 'react'
import {
  FilePlus2, Send, ThumbsUp, ThumbsDown, Sparkles, Tag, ClipboardList, Calculator,
  AlertTriangle, CheckCircle2, XCircle, Bell, Inbox, Building2,
} from 'lucide-react'
import { useApp } from '../../context/AppStateContext.jsx'
import { Card, Badge, Banner, SectionTitle } from '../common/ui.jsx'
import { MILESTONES, fmtSAR } from '../../data/mock.js'

// ── plain-language maps (NO Git/branch/merge/baseline terms in the UI) ──────
const IMPACT = {
  none: { tone: 'ok', ar: 'لا أثر', en: 'No impact' },
  minor: { tone: 'warn', ar: 'أثر بسيط', en: 'Minor' },
  major: { tone: 'bad', ar: 'أثر كبير', en: 'Major' },
}
const AXES = [
  { key: 'scope', ar: 'النطاق', en: 'Scope' },
  { key: 'spec', ar: 'المواصفات', en: 'Specifications' },
  { key: 'schedule', ar: 'الجدول الزمني', en: 'Schedule / milestones' },
  { key: 'local', ar: 'المحتوى المحلي', en: 'Local content %' },
]
const STATUS = {
  sent_to_contractor: { tone: 'warn', ar: 'بانتظار دراسة المقاول', en: 'Awaiting contractor study' },
  under_study: { tone: 'info', ar: 'قيد الدراسة لدى المقاول', en: 'Under study by contractor' },
  submitted_for_review: { tone: 'warn', ar: 'بانتظار مراجعة الجهة', en: 'Awaiting authority review' },
  merged: { tone: 'ok', ar: 'دُمج في الخطة المعتمدة', en: 'Added to the approved plan' },
  rejected: { tone: 'bad', ar: 'مرفوض', en: 'Rejected' },
}

export default function ChangeRequestFlow() {
  const app = useApp()
  const { state, lang, tx } = app
  const ch = state.change
  const role = state.role
  const status = ch.status

  return (
    <Card className="card-pad mb-6 border-cyan-200">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <SectionTitle icon={FilePlus2}>{tx({ ar: 'طلب تغيير', en: 'Change request' })}</SectionTitle>
        {status !== 'none' && (
          <Badge tone={STATUS[status].tone}>{tx({ ar: STATUS[status].ar, en: STATUS[status].en })}</Badge>
        )}
      </div>

      {role === 'owner' && <OwnerView app={app} ch={ch} lang={lang} tx={tx} />}
      {role === 'sara' && <SaraView app={app} ch={ch} lang={lang} tx={tx} />}
      {role === 'khalid' && <KhalidView app={app} ch={ch} lang={lang} tx={tx} />}
      {role === 'financier' && <ReadOnlyStatus ch={ch} lang={lang} tx={tx} />}
    </Card>
  )
}

// Compact request summary reused across roles.
function RequestSummary({ ch, lang, tx }) {
  if (ch.status === 'none') return null
  const itemLabel =
    ch.item === 'new_scope'
      ? tx({ ar: 'نطاق جديد', en: 'New scope' })
      : (() => { const m = MILESTONES.find((x) => x.id === ch.item); return m ? (lang === 'ar' ? m.nameAr : m.nameEn) : ch.item })()
  return (
    <div className="rounded-xl border border-line bg-page p-3 text-sm">
      <div className="font-bold text-teal-900">{ch.title}</div>
      {ch.desc && <p className="mt-0.5 text-teal-600">{ch.desc}</p>}
      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-teal-500">
        <Building2 className="h-3.5 w-3.5" /> {tx({ ar: 'البند المتأثر', en: 'Affected item' })}: <b className="text-teal-700">{itemLabel}</b>
      </div>
    </div>
  )
}

// ───────────────────────────── OWNER ───────────────────────────────────────
function OwnerView({ app, ch, lang, tx }) {
  const [title, setTitle] = useState('توريد وحدات إضافية')
  const [desc, setDesc] = useState('إضافة توريد وحدات إضافية ضمن نطاق العقد القائم.')
  const [item, setItem] = useState('new_scope')

  if (ch.status === 'none') {
    return (
      <div className="space-y-3">
        <p className="text-sm text-teal-600">{tx({ ar: 'صِف التغيير المطلوب بلغة بسيطة، وحدّد البند المتأثر، وأرسله للمقاول لدراسته.', en: 'Describe the requested change in plain language, pick the affected item, and send it to the contractor to study.' })}</p>
        <label className="block">
          <span className="label">{tx({ ar: 'عنوان التغيير', en: 'Title' })}</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-teal-900 focus:border-cyan-500 focus:outline-none" />
        </label>
        <label className="block">
          <span className="label">{tx({ ar: 'وصف مختصر', en: 'Short description' })}</span>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2}
            className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-teal-900 focus:border-cyan-500 focus:outline-none" />
        </label>
        <label className="block">
          <span className="label">{tx({ ar: 'البند المتأثر', en: 'Affected work item' })}</span>
          <select value={item} onChange={(e) => setItem(e.target.value)}
            className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-semibold text-teal-900 focus:border-cyan-500 focus:outline-none">
            <option value="new_scope">{tx({ ar: 'نطاق جديد', en: 'New scope' })}</option>
            {MILESTONES.map((m) => (<option key={m.id} value={m.id}>{lang === 'ar' ? m.nameAr : m.nameEn}</option>))}
          </select>
        </label>
        <button className="btn-primary w-full" disabled={!title.trim()} onClick={() => app.raiseChange(title.trim(), desc.trim(), item)}>
          <Send className="h-4 w-4" /> {tx({ ar: 'إرسال الطلب إلى المقاول', en: 'Send request to contractor' })}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <RequestSummary ch={ch} lang={lang} tx={tx} />
      {ch.status === 'merged' && (
        <Banner tone="ok" icon={CheckCircle2} title={tx({ ar: 'دُمج التغيير في الخطة المعتمدة.', en: 'The change was added to the approved plan.' })}>
          {tx({ ar: `قيمة التغيير ${fmtSAR(ch.price)} ر.س — حُدّثت قيمة العقد ولوحة المتابعة.`, en: `Change value ${fmtSAR(ch.price)} SAR — the contract value and dashboard were updated.` })}
        </Banner>
      )}
      {ch.status === 'rejected' && (
        <Banner tone="bad" icon={XCircle} title={tx({ ar: 'رُفض التغيير — بقيت الخطة كما هي.', en: 'The change was rejected — the plan is unchanged.' })}>{ch.rejectReason}</Banner>
      )}
      {(ch.status === 'sent_to_contractor' || ch.status === 'under_study' || ch.status === 'submitted_for_review') && (
        <Banner tone="info" icon={ClipboardList} title={tx({ ar: 'الطلب لدى المقاول / قيد المراجعة.', en: 'The request is with the contractor / under review.' })} />
      )}
    </div>
  )
}

// ───────────────────────────── SARA ────────────────────────────────────────
function SaraView({ app, ch, lang, tx }) {
  if (ch.status === 'none') {
    return <p className="text-sm text-teal-500">{tx({ ar: 'لا توجد طلبات تغيير حاليًا.', en: 'No change requests right now.' })}</p>
  }
  if (ch.status === 'sent_to_contractor') {
    return (
      <div className="space-y-3">
        <Banner tone="warn" icon={Bell} title={tx({ ar: 'لديك طلب تغيير جديد من الجهة.', en: 'You have a new change request from the authority.' })} />
        <RequestSummary ch={ch} lang={lang} tx={tx} />
        <button className="btn-primary" onClick={app.openChangeStudy}>
          <ClipboardList className="h-4 w-4" /> {tx({ ar: 'ادرس التغيير', en: 'Study the change' })}
        </button>
      </div>
    )
  }
  if (ch.status === 'under_study') {
    return <StudyPanel app={app} ch={ch} lang={lang} tx={tx} />
  }
  if (ch.status === 'submitted_for_review') {
    return (
      <div className="space-y-3">
        <RequestSummary ch={ch} lang={lang} tx={tx} />
        <Banner tone="info" icon={Send} title={tx({ ar: 'أُرسلت النسخة المعدّلة من الدراسة للمراجعة.', en: 'The updated study was sent for review.' })}>
          {tx({ ar: 'بانتظار قرار الجهة (اعتماد أو رفض).', en: 'Waiting for the authority’s decision (approve or reject).' })}
        </Banner>
      </div>
    )
  }
  if (ch.status === 'merged') {
    return (
      <div className="space-y-3">
        <RequestSummary ch={ch} lang={lang} tx={tx} />
        <Banner tone="ok" icon={CheckCircle2} title={tx({ ar: 'دُمج في الخطة المعتمدة ✓', en: 'Added to the approved plan ✓' })}>
          {tx({ ar: `أُضيف بند بقيمة ${fmtSAR(ch.price)} ر.س إلى الخطة، واستؤنف الدفع.`, en: `A ${fmtSAR(ch.price)} SAR item was added to the plan, and payment resumed.` })}
        </Banner>
      </div>
    )
  }
  // rejected
  return (
    <div className="space-y-3">
      <RequestSummary ch={ch} lang={lang} tx={tx} />
      <Banner tone="bad" icon={XCircle} title={tx({ ar: 'مرفوض', en: 'Rejected' })}>
        {ch.rejectReason || tx({ ar: 'بقيت الخطة المعتمدة كما هي.', en: 'The approved plan is unchanged.' })}
      </Banner>
    </div>
  )
}

// 3-stage study panel (mirrors Step 1's Price it / Plan it / Check the numbers).
function StudyPanel({ app, ch, lang, tx }) {
  const [tab, setTab] = useState('price')
  const low = ch.price < ch.suggested * 0.75
  const newTotal = app.CONTRACT_BASE + ch.price
  const cashImpactPct = Math.round((ch.price / app.CONTRACT_BASE) * 100)

  const TABS = [
    { id: 'price', icon: Tag, ar: 'التسعير', en: 'Price it' },
    { id: 'tech', icon: ClipboardList, ar: 'الدراسة الفنية', en: 'Technical study' },
    { id: 'fin', icon: Calculator, ar: 'الدراسة المالية', en: 'Financial study' },
  ]

  return (
    <div className="space-y-3">
      <RequestSummary ch={ch} lang={lang} tx={tx} />

      {/* tabs */}
      <div className="grid grid-cols-3 gap-2">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-semibold transition ${active ? 'border-cyan-300 bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200' : 'border-line bg-white text-teal-600 hover:bg-page'}`}>
              <Icon className="h-4 w-4" /> {tx({ ar: t.ar, en: t.en })}
            </button>
          )
        })}
      </div>

      <div className="rounded-xl border border-line bg-white p-3">
        {tab === 'price' && (
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-teal-900"><Sparkles className="h-4 w-4 text-cyan-500" /> {tx({ ar: 'اقتراح سعر ذكي', en: 'Smart price suggestion' })}</div>
            <p className="mt-1 text-xs text-teal-600">{tx({ ar: `السعر المرجعي المقترح: ${fmtSAR(ch.suggested)} ر.س. عدّل القيمة حسب تقديرك.`, en: `Benchmark suggestion: ${fmtSAR(ch.suggested)} SAR. Adjust as you see fit.` })}</p>
            {low && (
              <Banner tone="warn" icon={AlertTriangle} title={tx({ ar: 'سعر منخفض قد لا يغطّي التكلفة', en: 'A low price may not cover your cost' })}>
                {tx({ ar: 'القيمة أقل بكثير من المقترح — تأكّد أنها كافية.', en: 'The value is well below the suggestion — make sure it’s enough.' })}
              </Banner>
            )}
            <label className="mt-3 block">
              <span className="label">{tx({ ar: 'سعر التغيير (ر.س)', en: 'Change price (SAR)' })}</span>
              <input type="number" value={ch.price} onChange={(e) => app.setChangePrice(Number(e.target.value) || 0)}
                className={`mt-1 w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-bold focus:outline-none ${low ? 'border-warn-500 text-warn-600' : 'border-line text-teal-900 focus:border-cyan-500'}`} />
            </label>
            <button className="btn-soft mt-2 px-3 py-1.5 text-xs" onClick={() => app.setChangePrice(ch.suggested)}>
              <Sparkles className="h-3.5 w-3.5" /> {tx({ ar: 'استخدم السعر المقترح', en: 'Use suggested price' })}
            </button>
          </div>
        )}

        {tab === 'tech' && (
          <div>
            <div className="text-sm font-bold text-teal-900">{tx({ ar: 'أثر التغيير على أربعة محاور', en: 'Impact across four axes' })}</div>
            <p className="mt-1 text-xs text-teal-600">{tx({ ar: 'مقترحة آليًا — عدّلها عند الحاجة.', en: 'Pre-filled automatically — adjust as needed.' })}</p>
            <ul className="mt-2 space-y-2">
              {AXES.map((ax) => {
                const lvl = ch.impacts[ax.key]
                return (
                  <li key={ax.key} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-page px-3 py-2">
                    <span className="text-sm font-medium text-teal-900">{tx({ ar: ax.ar, en: ax.en })}</span>
                    <div className="flex items-center gap-1.5">
                      {['none', 'minor', 'major'].map((opt) => (
                        <button key={opt} onClick={() => app.setChangeImpact(ax.key, opt)}
                          className={`chip px-2.5 py-1 text-[11px] ${lvl === opt
                            ? (opt === 'none' ? 'bg-ok-500 text-white' : opt === 'minor' ? 'bg-warn-500 text-white' : 'bg-bad-500 text-white')
                            : 'border border-line bg-white text-teal-600 hover:bg-white'}`}>
                          {tx({ ar: IMPACT[opt].ar, en: IMPACT[opt].en })}
                        </button>
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {tab === 'fin' && (
          <div className="space-y-2">
            <div className="text-sm font-bold text-teal-900">{tx({ ar: 'الأثر المالي', en: 'Financial impact' })}</div>
            <Row label={tx({ ar: 'قيمة التغيير', en: 'Change value' })} value={`${fmtSAR(ch.price)} ${tx({ ar: 'ر.س', en: 'SAR' })}`} tone="cyan" />
            <Row label={tx({ ar: 'قيمة العقد الحالية', en: 'Current contract value' })} value={`${fmtSAR(app.CONTRACT_BASE)} ${tx({ ar: 'ر.س', en: 'SAR' })}`} />
            <Row label={tx({ ar: 'القيمة الجديدة لو اعتُمد', en: 'New total if approved' })} value={`${fmtSAR(newTotal)} ${tx({ ar: 'ر.س', en: 'SAR' })}`} tone="ok" />
            <p className="flex items-center gap-1.5 pt-1 text-xs text-teal-600">
              <Calculator className="h-3.5 w-3.5" /> {tx({ ar: `أثر تقديري على التدفّق النقدي: +${cashImpactPct}% على الدفعة القادمة.`, en: `Estimated cash-flow impact: +${cashImpactPct}% on the next payment.` })}
            </p>
          </div>
        )}
      </div>

      <Banner tone="info" icon={ClipboardList} title={tx({ ar: 'لن يُرسل شيء تلقائيًا — راجع المراحل الثلاث ثم أرسل.', en: 'Nothing is auto-submitted — review the three stages, then send.' })} />
      <button className="btn-primary w-full" onClick={app.sendChangeForReview}>
        <Send className="h-4 w-4" /> {tx({ ar: 'إرسال للمراجعة', en: 'Send for review' })}
      </button>
    </div>
  )
}

// ───────────────────────────── KHALID ──────────────────────────────────────
function KhalidView({ app, ch, lang, tx }) {
  const [reason, setReason] = useState('')
  const [showReject, setShowReject] = useState(false)

  if (ch.status === 'none' || ch.status === 'sent_to_contractor' || ch.status === 'under_study') {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-line bg-page px-3 py-3 text-sm text-teal-500">
        <Inbox className="h-4 w-4" /> {tx({ ar: 'لا يوجد طلب جاهز للمراجعة حاليًا.', en: 'Nothing to review right now.' })}
      </div>
    )
  }

  if (ch.status === 'submitted_for_review') {
    const major = AXES.some((ax) => ch.impacts[ax.key] === 'major')
    return (
      <div className="space-y-3">
        <RequestSummary ch={ch} lang={lang} tx={tx} />

        {/* four-axis summary chips */}
        <div className="grid grid-cols-2 gap-2">
          {AXES.map((ax) => {
            const lvl = ch.impacts[ax.key]
            return (
              <div key={ax.key} className="flex items-center justify-between rounded-lg border border-line bg-page px-3 py-2 text-sm">
                <span className="text-teal-700">{tx({ ar: ax.ar, en: ax.en })}</span>
                <Badge tone={IMPACT[lvl].tone}>{tx({ ar: IMPACT[lvl].ar, en: IMPACT[lvl].en })}</Badge>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm">
          <span className="text-teal-700">{tx({ ar: 'قيمة التغيير', en: 'Change value' })}</span>
          <span className="tnum font-bold text-teal-900">{fmtSAR(ch.price)} {tx({ ar: 'ر.س', en: 'SAR' })}</span>
        </div>

        {/* AI advisory — never auto-decides */}
        <Banner tone={major ? 'warn' : 'ok'} icon={Sparkles} title={tx({ ar: 'توصية المساعد الذكي', en: 'Smart assistant recommendation' })}>
          {major
            ? tx({ ar: 'يوجد أثر كبير على أحد المحاور — يُنصح بالمراجعة بعناية قبل القرار.', en: 'A major impact was detected on one axis — review carefully before deciding.' })
            : tx({ ar: 'الأثر ضمن المقبول — يبدو آمنًا للاعتماد. القرار النهائي لك.', en: 'Impact looks acceptable — looks safe to approve. The final decision is yours.' })}
        </Banner>

        {!showReject ? (
          <div className="flex items-center gap-2">
            <button className="btn-ok" onClick={app.approveChange}><ThumbsUp className="h-4 w-4" /> {tx({ ar: 'اعتماد', en: 'Approve' })}</button>
            <button className="btn px-4 py-2.5 bg-bad-500 text-white hover:bg-bad-600" onClick={() => setShowReject(true)}><ThumbsDown className="h-4 w-4" /> {tx({ ar: 'رفض', en: 'Reject' })}</button>
          </div>
        ) : (
          <div className="space-y-2 rounded-xl border border-bad-100 bg-bad-50 p-3">
            <label className="block">
              <span className="label text-bad-600">{tx({ ar: 'سبب الرفض', en: 'Reason for rejection' })}</span>
              <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder={tx({ ar: 'سبب مختصر…', en: 'Short reason…' })}
                className="mt-1 w-full rounded-xl border border-bad-100 bg-white px-3 py-2.5 text-sm text-teal-900 focus:border-bad-500 focus:outline-none" />
            </label>
            <div className="flex items-center gap-2">
              <button className="btn px-4 py-2 bg-bad-500 text-white hover:bg-bad-600 disabled:opacity-40" disabled={!reason.trim()} onClick={() => app.rejectChange(reason.trim())}>
                <XCircle className="h-4 w-4" /> {tx({ ar: 'تأكيد الرفض', en: 'Confirm rejection' })}
              </button>
              <button className="btn-ghost px-3 py-2 text-sm" onClick={() => setShowReject(false)}>{tx({ ar: 'إلغاء', en: 'Cancel' })}</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // merged / rejected outcome
  return (
    <div className="space-y-3">
      <RequestSummary ch={ch} lang={lang} tx={tx} />
      {ch.status === 'merged' ? (
        <Banner tone="ok" icon={CheckCircle2} title={tx({ ar: 'اعتُمد ودُمج في الخطة المعتمدة.', en: 'Approved and added to the plan.' })} />
      ) : (
        <Banner tone="bad" icon={XCircle} title={tx({ ar: 'رُفض الطلب.', en: 'Request rejected.' })}>{ch.rejectReason}</Banner>
      )}
    </div>
  )
}

// Read-only status for the financier / any other role.
function ReadOnlyStatus({ ch, lang, tx }) {
  if (ch.status === 'none') {
    return <p className="text-sm text-teal-500">{tx({ ar: 'لا توجد طلبات تغيير حاليًا.', en: 'No change requests right now.' })}</p>
  }
  return (
    <div className="space-y-2">
      <RequestSummary ch={ch} lang={lang} tx={tx} />
      {ch.status !== 'merged' && ch.status !== 'rejected' && (
        <Banner tone="warn" icon={AlertTriangle} title={tx({ ar: 'الدفع متوقّف مؤقتًا حتى يُحسم طلب التغيير.', en: 'Payment is paused until the change request is resolved.' })} />
      )}
    </div>
  )
}

function Row({ label, value, tone }) {
  const c = tone === 'ok' ? 'text-ok-600' : tone === 'cyan' ? 'text-cyan-600' : 'text-teal-900'
  return (
    <div className="flex items-center justify-between rounded-lg bg-page px-3 py-2 text-sm">
      <span className="text-teal-600">{label}</span>
      <span className={`tnum font-bold ${c}`}>{value}</span>
    </div>
  )
}
