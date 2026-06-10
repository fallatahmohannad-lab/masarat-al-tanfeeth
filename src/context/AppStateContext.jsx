import { createContext, useContext, useMemo, useReducer, useCallback } from 'react'
import { lookup, STEPS } from '../i18n/strings.js'
import { PRICE_ITEMS, MILESTONES, CHANGE_REQUEST, LOCAL_CONTENT } from '../data/mock.js'
import { AUDIT_POOL } from '../data/aiFlow.js'

const Ctx = createContext(null)

// Deterministic id counter (replay-safe; no Date.now/Math.random).
let SEQ = 100
const nextId = () => ++SEQ

// Append-only activity entry. The list can only be appended to — never edited —
// which is what makes the history "locked & tamper-proof".
const log = (state, actor, ar, en) => ({
  ...state,
  activity: [...state.activity, { id: nextId(), actor, ar, en }],
})

// A price line is "too low" when it is more than 25% below the smart suggestion.
export function withLowFlags(items) {
  return items.map((it) => ({
    ...it,
    low: it.entered < it.suggested * 0.75,
    total: it.entered * it.qty,
  }))
}

const initialState = {
  lang: 'ar',
  role: 'sara',
  step: 1,

  // ---- Auth / onboarding / subscription ----
  isAuthenticated: false,
  companyProfile: null, // { companyEmail, crNumber, sector, companySize, localContentTarget }
  selectedSubscriptionTier: 'none', // 'lean_mvp' | 'growth_sme' | 'enterprise_bimodal'

  // Step 1 — Start the bid
  priceItems: withLowFlags(PRICE_ITEMS),
  priced: false,
  usedSmart: false,
  planConfirmed: false,
  numbersChecked: false,
  bidReady: false,

  // Step 2 — Record delivery
  ingestionMode: 'manual', // 'manual' | 'auto'
  delivery: {}, // id -> { delivered:bool, proof:bool }

  // Step 3 — Check & changes
  flagged: [], // milestone/item ids flagged faulty
  mismatchResolved: false,
  changeStatus: 'open', // 'open' | 'approved' | 'rejected'

  // Step 4 — Submit
  localContentChecked: false,
  submitted: false,

  // Step 5 — Payment
  paymentApproved: false,

  // ---- SIDF strategic-UX state (Tender #4000003855) ----
  // LCGPA (local-content) conditional gate
  localContentScore: 58, // current contractor score (%)
  targetLocalContentScore: 65, // mandatory target (%)
  claimValue: 1_200_000, // current workflow claim value (SAR)
  // Bill of localizable materials — switching an item to local raises the score
  localMaterials: [
    { id: 'm1', nameAr: 'كابلات وأسلاك نحاسية', nameEn: 'Copper cables & wiring', isLocal: true, points: 10 },
    { id: 'm2', nameAr: 'مضخات هيدروليكية', nameEn: 'Hydraulic pumps', isLocal: false, points: 7 },
    { id: 'm3', nameAr: 'لوحات تحكم كهربائية', nameEn: 'Electrical control panels', isLocal: false, points: 5 },
  ],

  // Section 8 — item rejection feedback loop
  isRejected: false,
  rejectedAt: null, // timestamp set when an asset is rejected

  // Section 7 — business continuity / offline field mode
  isOffline: false,
  offlineQueue: 0, // encrypted field records awaiting sync

  // Framework-agreement open sub-work orders (trapped capital / liquidity risk)
  openWorkOrders: [
    { id: 'wo-1', assetName: 'وحدة التبريد المركزية - مصنع رابغ', wbsCode: 'PR-MRO-04-WBS-002', trappedCapital: 450000, daysLeft: 2 },
    { id: 'wo-2', assetName: 'مضخات التدفق الهيدروليكي العالي', wbsCode: 'PR-MRO-04-WBS-009', trappedCapital: 750000, daysLeft: 5 },
  ],

  // ---- AI-governed procurement & financing architecture ----
  view: 'home', // 'home' (landing dashboard) | 'journey' (5-step workflow)

  // Contractor portfolio counters (Landing dashboard)
  completedProjects: 4,
  activeProjects: 3,
  delayedProjects: 1,
  selectedProjectFilter: null, // null = aggregated view across ALL projects

  // Tender lifecycle state machine
  tenderStage: 'matching', // matching → bidding → wbs_generation → awarded → claim_validation → audit → finance_approved
  selectedTender: 'tdr-1',
  pricingEvaluated: false,
  bookletBought: false,
  studyGenerated: false,
  awarded: false,

  // AI claim validation
  claimRaised: false,
  claimVerified: false,
  claimSubmitted: false,
  validatedClaim: 1_200_000, // the Movement Engine adjusts this on audit rejections

  // Khalid's smart audit
  auditItems: [],
  auditGenerated: false,

  // Financier / movement revenue engine
  riskFactor: 24, // dynamic risk score (%) — lower is safer
  financingRequested: false,
  fundApproved: false,
  generatedRevenue: 0,

  activity: [{ id: nextId(), actor: 'system', ar: 'تم استلام الكراسة', en: 'RFP received' }],
}

// Deterministic "random" subset draw for the AI audit list.
function drawAuditItems(seed) {
  const ranked = AUDIT_POOL.map((it, i) => ({ it, k: (it.id.charCodeAt(3) * 13 + seed + i * 7) % 17 }))
  ranked.sort((x, y) => x.k - y.k)
  return ranked.slice(0, 4).map(({ it }) => ({ ...it, status: 'pending' }))
}

function reducer(state, a) {
  switch (a.type) {
    case 'LANG':
      return { ...state, lang: a.lang }
    case 'ROLE':
      return log({ ...state, role: a.role }, a.role, 'تبديل الدور', 'Switched role')
    case 'STEP':
      return { ...state, step: a.n }

    // ---- Step 1 ----
    case 'PRICE':
      return {
        ...state,
        priceItems: withLowFlags(state.priceItems.map((it) => (it.id === a.id ? { ...it, entered: a.val } : it))),
      }
    case 'USE_SMART': {
      const items = withLowFlags(state.priceItems.map((it) => ({ ...it, entered: it.suggested })))
      return log({ ...state, priceItems: items, usedSmart: true, priced: true }, 'sara', 'استخدام اقتراح السعر الذكي', 'Used smart price suggestion')
    }
    case 'MARK_PRICED':
      return log({ ...state, priced: true }, 'sara', 'تم تسعير العرض', 'Priced the bid')
    case 'CONFIRM_PLAN':
      return log({ ...state, planConfirmed: true }, 'sara', 'تم تأكيد خطة المعالم', 'Confirmed the milestone plan')
    case 'CHECK_NUMBERS':
      return log({ ...state, numbersChecked: true }, 'sara', 'تمت مراجعة الأرقام', 'Reviewed the numbers')
    case 'BID_READY':
      return log({ ...state, bidReady: true, step: 2 }, 'sara', 'خطة العرض جاهزة للمراجعة', 'Bid plan ready for review')

    // ---- Step 2 ----
    case 'INGEST_MODE':
      return { ...state, ingestionMode: a.mode }
    case 'DELIVER': {
      const cur = state.delivery[a.id] || {}
      return log({ ...state, delivery: { ...state.delivery, [a.id]: { ...cur, delivered: true } } }, 'sara', `تم تسليم: ${a.labelAr}`, `Delivered: ${a.labelEn}`)
    }
    case 'PROOF': {
      const cur = state.delivery[a.id] || {}
      return log({ ...state, delivery: { ...state.delivery, [a.id]: { ...cur, proof: true } } }, 'sara', `إرفاق إثبات: ${a.labelAr}`, `Attached proof: ${a.labelEn}`)
    }
    case 'AUTO_SYNC': {
      const delivery = {}
      MILESTONES.forEach((m) => (delivery[m.id] = { delivered: true, proof: true }))
      return log({ ...state, delivery, ingestionMode: 'auto' }, 'sara', 'مزامنة تلقائية من نظام المقاول', 'Auto-synced from contractor system')
    }

    // ---- Step 3 ----
    case 'FLAG': {
      const flagged = state.flagged.includes(a.id) ? state.flagged.filter((x) => x !== a.id) : [...state.flagged, a.id]
      const on = flagged.includes(a.id)
      return log({ ...state, flagged }, 'sara', on ? `الإبلاغ عن بند معيب: ${a.labelAr}` : `إلغاء البلاغ: ${a.labelAr}`, on ? `Flagged faulty item: ${a.labelEn}` : `Cleared flag: ${a.labelEn}`)
    }
    case 'RESOLVE_MISMATCH':
      return log({ ...state, mismatchResolved: true }, 'khalid', 'تمت معالجة فرق الكميات', 'Resolved quantity mismatch')
    case 'DECIDE_CHANGE':
      return log({ ...state, changeStatus: a.decision }, a.actor, a.decision === 'approved' ? 'تم اعتماد طلب التغيير' : 'تم رفض طلب التغيير', a.decision === 'approved' ? 'Approved change request' : 'Rejected change request')

    // ---- Step 4 ----
    case 'LOCAL_CHECK':
      return log({ ...state, localContentChecked: true }, 'sara', `فحص المحتوى المحلي: ${LOCAL_CONTENT.score}%`, `Local-content check: ${LOCAL_CONTENT.score}%`)
    case 'SUBMIT':
      return log({ ...state, submitted: true, step: 5 }, 'sara', 'تم الإرسال إلى اعتماد', 'Submitted to Etimad')

    // ---- Step 5 ----
    case 'APPROVE_PAYMENT':
      return log({ ...state, paymentApproved: true }, 'owner', 'تم اعتماد صرف الدفعة', 'Approved payment')

    // ---- SIDF strategic-UX reducers ----
    // Section 8 — Khalid rejects/clears an asset; arms the 7-working-day clock.
    case 'TOGGLE_REJECTION': {
      const on = !state.isRejected
      return log(
        { ...state, isRejected: on, rejectedAt: on ? a.ts ?? null : null },
        'khalid',
        on ? 'رفض بند فني — البند الثامن (رفض البنود)' : 'إلغاء حالة الرفض',
        on ? 'Rejected item — Section 8 (Item Rejection)' : 'Cleared rejection',
      )
    }
    // LCGPA — localize a material, recompute the local-content score.
    case 'LOCALIZE_MATERIAL': {
      const mat = state.localMaterials.find((m) => m.id === a.id)
      if (!mat) return state
      const nextLocal = !mat.isLocal
      const delta = nextLocal ? mat.points : -mat.points
      const score = Math.max(0, Math.min(100, state.localContentScore + delta))
      const materials = state.localMaterials.map((m) => (m.id === a.id ? { ...m, isLocal: nextLocal } : m))
      return log(
        { ...state, localMaterials: materials, localContentScore: score },
        'sara',
        nextLocal ? `توطين مادة: ${mat.nameAr} (+${mat.points}%)` : `إرجاع مادة لمستورد: ${mat.nameAr}`,
        nextLocal ? `Localized material: ${mat.nameEn}` : `Reverted to imported: ${mat.nameEn}`,
      )
    }
    // Section 7 — offline field mode; on reconnect, queued records sync to the spine.
    case 'SET_OFFLINE': {
      if (!a.on && state.isOffline && state.offlineQueue > 0) {
        return log(
          { ...state, isOffline: false, offlineQueue: 0 },
          'system',
          `مزامنة ${state.offlineQueue} سجلًا ميدانيًا مشفّرًا مع سجل التدقيق`,
          `Synced ${state.offlineQueue} encrypted field records to the audit spine`,
        )
      }
      return log(
        { ...state, isOffline: a.on },
        'system',
        a.on ? 'تفعيل الوضع الميداني دون اتصال' : 'العودة للاتصال',
        a.on ? 'Offline field mode enabled' : 'Back online',
      )
    }
    case 'QUEUE_OFFLINE':
      return { ...state, offlineQueue: state.offlineQueue + 1 }

    // ---- Auth / onboarding / subscription reducers ----
    case 'SELECT_SUBSCRIPTION':
      return { ...state, selectedSubscriptionTier: a.tier }
    case 'UPDATE_COMPANY_PROFILE':
      return { ...state, companyProfile: { ...(state.companyProfile || {}), ...a.profile } }
    case 'LOGIN_SUCCESS':
      return log(
        {
          ...state,
          isAuthenticated: true,
          companyProfile: a.profile ? { ...(state.companyProfile || {}), ...a.profile } : state.companyProfile,
          selectedSubscriptionTier: a.tier || state.selectedSubscriptionTier,
        },
        'sara',
        'تفعيل الحساب والدخول إلى المنصة',
        'Account activated · entered the platform',
      )

    // ---- AI-governed workflow reducers ----
    case 'SET_VIEW':
      return { ...state, view: a.view }
    case 'SET_PROJECT_FILTER':
      return { ...state, selectedProjectFilter: a.id }
    case 'SELECT_TENDER':
      return { ...state, selectedTender: a.id, pricingEvaluated: false }
    case 'RUN_PRICING':
      return log({ ...state, pricingEvaluated: true }, 'sara', 'تشغيل التسعير المبدئي الذكي لتقييم هامش الربح', 'Ran initial AI pricing')
    case 'BUY_BOOKLET':
      return log({ ...state, bookletBought: true, tenderStage: 'bidding' }, 'sara', 'شراء كراسة المنافسة والدخول في مرحلة التقديم', 'Bought the RFP booklet · entered bidding')
    case 'GENERATE_STUDY':
      return log({ ...state, studyGenerated: true, tenderStage: 'wbs_generation' }, 'system', 'محرّك الذكاء يولّد دراسة فنية ومالية مقفلة (WBS وBOQ)', 'AI engine generated a locked technical & financial study (WBS/BOQ)')
    case 'SIMULATE_AWARD':
      return log({ ...state, awarded: true, tenderStage: 'awarded' }, 'owner', 'ترسية أمر العمل على المقاول عبر اعتماد', 'Awarded the work order via Etimad')
    case 'RAISE_CLAIM':
      return log({ ...state, claimRaised: true, tenderStage: 'claim_validation' }, 'sara', 'رفع المستخلص بعد تنفيذ الأعمال', 'Raised the claim after delivery')
    case 'VALIDATE_CLAIM':
      return log({ ...state, claimVerified: true }, 'system', 'محرّك الامتثال الذكي طابق المستخلص مع WBS/BOQ المعتمدة', 'AI compliance engine matched the claim to the approved WBS/BOQ')
    case 'SUBMIT_CLAIM':
      return log({ ...state, claimSubmitted: true, tenderStage: 'audit' }, 'sara', 'إرسال المستخلص الموثّق إلى منصة اعتماد', 'Submitted the verified claim to Etimad')
    case 'GENERATE_AUDIT':
      return log({ ...state, auditItems: drawAuditItems(nextId()), auditGenerated: true }, 'system', 'توليد قائمة الفحص العشوائية الذكية للمُقيّم', 'Generated the random AI audit list for the inspector')
    case 'AUDIT_DECISION': {
      const item = state.auditItems.find((it) => it.id === a.id)
      if (!item) return state
      const items = state.auditItems.map((it) => (it.id === a.id ? { ...it, status: a.decision } : it))
      let validatedClaim = state.validatedClaim
      let riskFactor = state.riskFactor
      // Movement Engine (قيد الحركة الفنية): a rejection removes the item's value
      // from the validated scope and raises risk; re-approving restores it.
      if (a.decision === 'rejected' && item.status !== 'rejected') {
        validatedClaim = Math.max(0, validatedClaim - item.scopeValue)
        riskFactor = Math.min(99, riskFactor + 7)
      } else if (a.decision === 'approved' && item.status === 'rejected') {
        validatedClaim += item.scopeValue
        riskFactor = Math.max(0, riskFactor - 7)
      }
      const anyRejected = items.some((it) => it.status === 'rejected')
      return log(
        { ...state, auditItems: items, validatedClaim, riskFactor, isRejected: anyRejected, rejectedAt: anyRejected ? state.rejectedAt : null },
        'khalid',
        a.decision === 'approved' ? `اعتماد بند فحص: ${item.labelAr}` : `رفض بند فحص (قيد حركة فنية): ${item.labelAr}`,
        a.decision === 'approved' ? `Approved audit item: ${item.labelEn}` : `Rejected audit item (movement entry): ${item.labelEn}`,
      )
    }
    case 'REQUEST_FINANCING':
      return log({ ...state, financingRequested: true }, 'sara', 'طلب تمويل فوري على المستخلص المعتمد من المُقيّم', 'Requested financing on the inspector-approved claim')
    case 'APPROVE_FUND':
      return log(
        { ...state, fundApproved: true, tenderStage: 'finance_approved', generatedRevenue: state.generatedRevenue + state.validatedClaim },
        'financier',
        'اعتماد وتمويل المستخلص — محرّك الحركة يولّد إيرادًا فعليًا للمشروع',
        'Approved & funded — the Movement Engine generated real project revenue',
      )

    case 'RESET':
      return {
        ...initialState,
        lang: state.lang,
        role: state.role,
        // keep the user signed in & their org/subscription on a demo restart
        isAuthenticated: state.isAuthenticated,
        companyProfile: state.companyProfile,
        selectedSubscriptionTier: state.selectedSubscriptionTier,
        activity: [{ id: nextId(), actor: 'system', ar: 'تم استلام الكراسة', en: 'RFP received' }],
      }

    default:
      return state
  }
}

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const lang = state.lang
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  const t = useCallback((key) => lookup(key, lang), [lang])
  const tx = useCallback((pair) => (pair ? pair[lang] ?? pair.ar : ''), [lang])

  // ---- derived ----
  const deliveredCount = MILESTONES.filter((m) => state.delivery[m.id]?.delivered).length
  const proofCount = MILESTONES.filter((m) => state.delivery[m.id]?.proof).length
  const allDelivered = deliveredCount === MILESTONES.length && proofCount === MILESTONES.length
  const changeCleared = state.changeStatus !== 'open'
  const localPass = LOCAL_CONTENT.score >= LOCAL_CONTENT.threshold
  // LCGPA gate: the local-content score must meet the mandatory target.
  const localContentMet = state.localContentScore >= state.targetLocalContentScore
  const canSubmit = allDelivered && state.mismatchResolved && changeCleared && localContentMet
  const paidClosed = state.paymentApproved

  // AI-governed workflow progress
  const auditDone = state.auditGenerated && state.auditItems.length > 0 && state.auditItems.every((i) => i.status !== 'pending')
  const stepDone = {
    1: state.bookletBought, // matching & pricing → booklet bought
    2: state.awarded, // study generated & awarded
    3: state.claimSubmitted, // claim validated & submitted
    4: auditDone, // smart audit complete
    5: state.fundApproved, // financed
  }
  const progress = Math.round((Object.values(stepDone).filter(Boolean).length / 5) * 100)

  const actions = useMemo(
    () => ({
      toggleLang: () => dispatch({ type: 'LANG', lang: lang === 'ar' ? 'en' : 'ar' }),
      setRole: (role) => dispatch({ type: 'ROLE', role }),
      goStep: (n) => dispatch({ type: 'STEP', n }),
      next: () => dispatch({ type: 'STEP', n: Math.min(5, state.step + 1) }),
      prev: () => dispatch({ type: 'STEP', n: Math.max(1, state.step - 1) }),
      setPrice: (id, val) => dispatch({ type: 'PRICE', id, val }),
      useSmart: () => dispatch({ type: 'USE_SMART' }),
      markPriced: () => dispatch({ type: 'MARK_PRICED' }),
      confirmPlan: () => dispatch({ type: 'CONFIRM_PLAN' }),
      checkNumbers: () => dispatch({ type: 'CHECK_NUMBERS' }),
      markBidReady: () => dispatch({ type: 'BID_READY' }),
      setIngestionMode: (mode) => dispatch({ type: 'INGEST_MODE', mode }),
      deliver: (id, labelAr, labelEn) => dispatch({ type: 'DELIVER', id, labelAr, labelEn }),
      attachProof: (id, labelAr, labelEn) => dispatch({ type: 'PROOF', id, labelAr, labelEn }),
      autoSync: () => dispatch({ type: 'AUTO_SYNC' }),
      flag: (id, labelAr, labelEn) => dispatch({ type: 'FLAG', id, labelAr, labelEn }),
      resolveMismatch: () => dispatch({ type: 'RESOLVE_MISMATCH' }),
      decideChange: (decision, actor) => dispatch({ type: 'DECIDE_CHANGE', decision, actor }),
      runLocalCheck: () => dispatch({ type: 'LOCAL_CHECK' }),
      submit: () => dispatch({ type: 'SUBMIT' }),
      approvePayment: () => dispatch({ type: 'APPROVE_PAYMENT' }),
      // SIDF strategic-UX actions
      toggleRejection: (ts) => dispatch({ type: 'TOGGLE_REJECTION', ts }),
      localizeMaterial: (id) => dispatch({ type: 'LOCALIZE_MATERIAL', id }),
      setOffline: (on) => dispatch({ type: 'SET_OFFLINE', on }),
      queueOffline: () => dispatch({ type: 'QUEUE_OFFLINE' }),
      // Auth / onboarding / subscription actions
      login: (payload) => dispatch({ type: 'LOGIN_SUCCESS', ...(payload || {}) }),
      updateCompanyProfile: (profile) => dispatch({ type: 'UPDATE_COMPANY_PROFILE', profile }),
      selectSubscription: (tier) => dispatch({ type: 'SELECT_SUBSCRIPTION', tier }),
      // AI-governed workflow actions
      setView: (view) => dispatch({ type: 'SET_VIEW', view }),
      enterJourney: (step) => { dispatch({ type: 'SET_VIEW', view: 'journey' }); if (step) dispatch({ type: 'STEP', n: step }) },
      setProjectFilter: (id) => dispatch({ type: 'SET_PROJECT_FILTER', id }),
      selectTender: (id) => dispatch({ type: 'SELECT_TENDER', id }),
      runPricing: () => dispatch({ type: 'RUN_PRICING' }),
      buyBooklet: () => dispatch({ type: 'BUY_BOOKLET' }),
      generateStudy: () => dispatch({ type: 'GENERATE_STUDY' }),
      simulateAward: () => dispatch({ type: 'SIMULATE_AWARD' }),
      raiseClaim: () => dispatch({ type: 'RAISE_CLAIM' }),
      validateClaim: () => dispatch({ type: 'VALIDATE_CLAIM' }),
      submitClaim: () => dispatch({ type: 'SUBMIT_CLAIM' }),
      generateAudit: () => dispatch({ type: 'GENERATE_AUDIT' }),
      auditDecision: (id, decision) => dispatch({ type: 'AUDIT_DECISION', id, decision }),
      requestFinancing: () => dispatch({ type: 'REQUEST_FINANCING' }),
      approveFund: () => dispatch({ type: 'APPROVE_FUND' }),
      reset: () => dispatch({ type: 'RESET' }),
    }),
    [lang, state.step],
  )

  const value = useMemo(
    () => ({
      state, lang, dir, t, tx,
      deliveredCount, proofCount, allDelivered, changeCleared, localPass, localContentMet, canSubmit, paidClosed,
      auditDone, stepDone, progress, STEPS,
      ...actions,
    }),
    [state, lang, dir, t, tx, deliveredCount, proofCount, allDelivered, changeCleared, localPass, localContentMet, canSubmit, paidClosed, auditDone, progress, actions],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useApp must be used within AppStateProvider')
  return c
}
