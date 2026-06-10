// Data for the AI-governed procurement & financing architecture (SIDF #4000003855).
// Executive Saudi procurement Arabic; bilingual where surfaced through tx().

// ── Contractor project portfolio (Landing dashboard) ──────────────────────
// 4 completed · 3 active · 1 delayed. Every dynamic property is a bilingual
// { ar, en } pair so the UI mirrors the active language; *Key fields drive logic.
const PAY = {
  paid: { paymentLabel: { ar: 'مدفوع', en: 'Paid' }, paymentState: { ar: 'تم الصرف بالكامل', en: 'Fully disbursed' } },
  partial: { paymentLabel: { ar: 'جزئي', en: 'Partial' }, paymentState: { ar: 'صرف جزئي معتمد', en: 'Partially disbursed' } },
  pending: { paymentLabel: { ar: 'معلّق', en: 'Pending' }, paymentState: { ar: 'قيد مراجعة المستخلص', en: 'Claim under review' } },
  held: { paymentLabel: { ar: 'محتجز', en: 'Held' }, paymentState: { ar: 'صرف محتجز', en: 'Payment held' } },
}
const ST = {
  active: { ar: 'نشط', en: 'Active' },
  delayed: { ar: 'متعثّر', en: 'Delayed' },
  completed: { ar: 'مكتمل', en: 'Completed' },
}

export const PROJECTS = [
  { id: 'p1', name: { ar: 'صيانة وتشغيل مرافق إدارية — جدة', en: 'Facilities O&M — Jeddah' }, statusKey: 'active', status: ST.active, progress: 74, paymentKey: 'partial', ...PAY.partial, phase: 2, bottleneck: { ar: 'تأخّر في المرحلة الثانية بسبب تعليق فحص المواد لدى المُقيّم الميداني.', en: 'Phase 2 delay due to a field material-inspection hold.' } },
  { id: 'p2', name: { ar: 'إنشاء مستودع لوجستي — الدمام', en: 'Logistics warehouse — Dammam' }, statusKey: 'active', status: ST.active, progress: 52, paymentKey: 'pending', ...PAY.pending, phase: 1, bottleneck: { ar: 'بانتظار اعتماد جدول تجزئة الأعمال (WBS) من الجهة.', en: 'Awaiting WBS approval from the authority.' } },
  { id: 'p3', name: { ar: 'أعمال كهروميكانيكية — الرياض', en: 'Electromechanical works — Riyadh' }, statusKey: 'active', status: ST.active, progress: 91, paymentKey: 'partial', ...PAY.partial, phase: 3, bottleneck: { ar: 'لا يوجد عائق حالي — المشروع ضمن الجدول.', en: 'No active bottleneck — on schedule.' } },
  { id: 'p4', name: { ar: 'صيانة محطة معالجة — شرورة', en: 'Treatment plant O&M — Sharurah' }, statusKey: 'delayed', status: ST.delayed, progress: 33, paymentKey: 'held', ...PAY.held, phase: 2, bottleneck: { ar: 'توقّف الصرف بسبب أمر تغيير غير معتمد وارتفاع رأس المال العالق.', en: 'Payment frozen by an unapproved change order; trapped capital rising.' } },
  { id: 'p5', name: { ar: 'توريد وتركيب مولّدات — جازان', en: 'Generators supply & install — Jazan' }, statusKey: 'completed', status: ST.completed, progress: 100, paymentKey: 'paid', ...PAY.paid, phase: 4, bottleneck: { ar: 'مكتمل ومدفوع.', en: 'Completed and paid.' } },
  { id: 'p6', name: { ar: 'أعمال مدنية — نيوم', en: 'Civil works — NEOM' }, statusKey: 'completed', status: ST.completed, progress: 100, paymentKey: 'paid', ...PAY.paid, phase: 4, bottleneck: { ar: 'مكتمل ومدفوع.', en: 'Completed and paid.' } },
  { id: 'p7', name: { ar: 'تحديث أنظمة الإطفاء — ينبع', en: 'Fire-systems upgrade — Yanbu' }, statusKey: 'completed', status: ST.completed, progress: 100, paymentKey: 'paid', ...PAY.paid, phase: 4, bottleneck: { ar: 'مكتمل ومدفوع.', en: 'Completed and paid.' } },
  { id: 'p8', name: { ar: 'صيانة مبانٍ حكومية — أبها', en: 'Gov. buildings O&M — Abha' }, statusKey: 'completed', status: ST.completed, progress: 100, paymentKey: 'paid', ...PAY.paid, phase: 4, bottleneck: { ar: 'مكتمل ومدفوع.', en: 'Completed and paid.' } },
]

// ── Stage 1 · Etimad tender matches by company profile ────────────────────
export const ETIMAD_MATCHES = [
  { id: 'tdr-1', title: { ar: 'صيانة وتشغيل مرافق صناعية — رابغ', en: 'Industrial facilities O&M — Rabigh' }, entity: { ar: 'صندوق التنمية الصناعية', en: 'Saudi Industrial Development Fund' }, value: 4_180_000, fit: 92, marginPct: 18, bookletFee: 2000 },
  { id: 'tdr-2', title: { ar: 'توريد قطع غيار MRO — الجبيل', en: 'MRO spare-parts supply — Jubail' }, entity: { ar: 'الهيئة الملكية بالجبيل', en: 'Royal Commission for Jubail' }, value: 2_650_000, fit: 78, marginPct: 11, bookletFee: 1500 },
  { id: 'tdr-3', title: { ar: 'أعمال كهروميكانيكية — الخرج', en: 'Electromechanical works — Al-Kharj' }, entity: { ar: 'وزارة البيئة والمياه والزراعة', en: 'Ministry of Environment, Water & Agriculture' }, value: 3_320_000, fit: 84, marginPct: 14, bookletFee: 2000 },
]

// ── Stage 2 · AI-generated locked study: WBS + BOQ matrices ────────────────
export const WBS_MATRIX = [
  { code: 'WBS-01', nameAr: 'التعبئة والتجهيز', nameEn: 'Mobilization', weight: 10 },
  { code: 'WBS-02', nameAr: 'الأعمال المدنية', nameEn: 'Civil works', weight: 30 },
  { code: 'WBS-03', nameAr: 'الأنظمة الكهروميكانيكية', nameEn: 'Electromechanical', weight: 28 },
  { code: 'WBS-04', nameAr: 'التشغيل التجريبي', nameEn: 'Commissioning', weight: 17 },
  { code: 'WBS-05', nameAr: 'التسليم والإغلاق', nameEn: 'Handover & close-out', weight: 15 },
]

export const BOQ_MATRIX = [
  { code: 'BOQ-1', nameAr: 'خرسانة مسلّحة', nameEn: 'Reinforced concrete', unitAr: 'م³', qty: 1200, rate: 950 },
  { code: 'BOQ-2', nameAr: 'مضخات هيدروليكية', nameEn: 'Hydraulic pumps', unitAr: 'وحدة', qty: 24, rate: 31000 },
  { code: 'BOQ-3', nameAr: 'كابلات نحاسية', nameEn: 'Copper cabling', unitAr: 'م.ط', qty: 8600, rate: 78 },
  { code: 'BOQ-4', nameAr: 'لوحات تحكم', nameEn: 'Control panels', unitAr: 'وحدة', qty: 16, rate: 42000 },
]

// ── Stage 4 · pool the inspector's "random AI audit list" is drawn from ────
// scopeValue = the validated amount this item carries (rejecting it removes it
// from the validated claim via the Movement Engine).
export const AUDIT_POOL = [
  { id: 'au-1', labelAr: 'مطابقة كميات الخرسانة المسلّحة مع جدول الكميات', labelEn: 'Match reinforced-concrete quantities to the BOQ', scopeValue: 180000 },
  { id: 'au-2', labelAr: 'فحص شهادة منشأ المضخات الهيدروليكية', labelEn: 'Verify hydraulic-pump certificate of origin', scopeValue: 240000 },
  { id: 'au-3', labelAr: 'التحقق من اختبارات تشغيل اللوحات الكهربائية', labelEn: 'Validate control-panel commissioning tests', scopeValue: 150000 },
  { id: 'au-4', labelAr: 'مطابقة منهجية تقييم الأصول (التكلفة/الدخل)', labelEn: 'Check asset-valuation methodology (cost/income)', scopeValue: 130000 },
  { id: 'au-5', labelAr: 'فحص توثيق المحتوى المحلي للمواد', labelEn: 'Inspect local-content documentation for materials', scopeValue: 110000 },
  { id: 'au-6', labelAr: 'التحقق الميداني من تركيب الكابلات', labelEn: 'Field-verify cabling installation', scopeValue: 90000 },
]

export const TENDER_STAGES = [
  { key: 'matching', ar: 'المطابقة', en: 'Matching' },
  { key: 'bidding', ar: 'التقديم', en: 'Bidding' },
  { key: 'wbs_generation', ar: 'توليد الدراسة', en: 'Study generation' },
  { key: 'awarded', ar: 'الترسية', en: 'Awarded' },
  { key: 'claim_validation', ar: 'التحقق من المستخلص', en: 'Claim validation' },
  { key: 'audit', ar: 'التدقيق', en: 'Audit' },
  { key: 'finance_approved', ar: 'اعتماد التمويل', en: 'Finance approved' },
]
