// Plain-language bilingual strings. Two helpers are used across the app:
//   t('key')      -> shared chrome string by key
//   tx({ar,en})   -> inline pair, returns the active-language value
// No internal engine names ever appear here — only friendly, jargon-free labels.

export const DICT = {
  brand: { ar: 'مسارات', en: 'Masaraat' },
  brand_tag: { ar: 'من الكراسة إلى استلام الدفعة', en: 'From RFP to paid' },
  reassure: {
    ar: 'كل خطوة مسجّلة ولا يمكن تعديلها لاحقًا.',
    en: "Every step is recorded and can't be changed after the fact.",
  },
  role: { ar: 'الدور', en: 'Role' },
  next: { ar: 'التالي', en: 'Next' },
  back: { ar: 'السابق', en: 'Back' },
  done: { ar: 'تم', en: 'Done' },
  approve: { ar: 'اعتماد', en: 'Approve' },
  reject: { ar: 'رفض', en: 'Reject' },
  resolve: { ar: 'معالجة', en: 'Resolve' },
  verified: { ar: 'موثّق', en: 'Verified' },
  waiting: { ar: 'بانتظار', en: 'Waiting' },
  activity: { ar: 'سجلّ الأنشطة (موثّق وغير قابل للتعديل)', en: 'Activity history (locked & tamper-proof)' },
  sar: { ar: 'ر.س', en: 'SAR' },
  home: { ar: 'الرئيسية', en: 'Home' },

  // Dashboard (global summaries / banners moved out of components)
  dash_projects: { ar: 'قائمة المشاريع', en: 'Projects' },
  dash_clear_filter: { ar: 'إلغاء الفرز', en: 'Clear filter' },
  dash_agg_title: { ar: 'لوحة الأداء العام المجمّعة لجميع المشاريع', en: 'Aggregated performance across all projects' },
  dash_agg_sub: { ar: 'تحليل شامل ومؤشرات التدفق النقدي المجمّعة لحساب المقاول.', en: 'Portfolio-wide analysis and aggregated cash-flow indicators for the contractor.' },
  dash_sel_title: { ar: 'تحليل المشروع المحدّد', en: 'Selected project analysis' },
  dash_sel_sub: { ar: 'تفاصيل الفحص الفني والتعثر المالي للمشروع المختار.', en: 'Technical inspection and financial bottleneck for the selected project.' },
  dash_avg_completion: { ar: 'متوسط نسبة الإنجاز المعتمدة', en: 'Average approved completion' },
  dash_completion: { ar: 'نسبة الإنجاز المعتمدة', en: 'Approved completion' },
  dash_payment_state: { ar: 'وضع الصرف المالي الحالي', en: 'Current disbursement status' },
  dash_quick_roles: { ar: 'انتقال سريع بين الأدوار', en: 'Quick role navigation' },
  dash_enter_as: { ar: 'الدخول كـ', en: 'Enter as' },
  sys_bottleneck_title: { ar: 'تحليل التعثر العام للنظام', en: 'System-wide bottleneck analysis' },
  sys_bottleneck_ok: { ar: 'لا يوجد تعثّر حرج في المحفظة.', en: 'No critical bottleneck in the portfolio.' },
  insights_title: { ar: 'تحليلات مسارات الاستباقية (AI Insights)', en: 'Masarat Proactive Analytics (AI Insights)' },
  insights_sub: { ar: 'تنبؤات استباقية لإغلاق فجوات القيمة قبل حدوثها.', en: 'Proactive predictions that close value gaps before they occur.' },
  start_from_role: { ar: 'ابدأ من دورك', en: 'Start from your role' },
  start_from_role_sub: { ar: 'ادخل بالدور المناسب إلى مسار التنفيذ المحوكم بالذكاء الاصطناعي.', en: 'Enter the AI-governed execution journey through the right role.' },
  start_journey_sara: { ar: 'ابدأ الرحلة كـ «سارة»', en: 'Start the journey as “Sara”' },

  // ── Onboarding / login / subscription ──
  ob_tag: { ar: 'بوابة الدخول المؤسسية وحوكمة البيانات', en: 'Institutional entry & data governance' },
  ob_welcome: { ar: 'مرحبًا بك في منصة حوكمة التنفيذ', en: 'Welcome to the execution-governance platform' },
  ob_welcome_sub: { ar: 'سجّل دخول منشأتك، وابنِ ملفك الرقمي، واختر باقة الحوكمة المناسبة للدخول إلى لوحات التنفيذ.', en: 'Sign in your entity, build your digital profile, and choose a governance plan to access the execution dashboards.' },

  ob_a_title: { ar: 'تسجيل الدخول وحوكمة البيانات', en: 'Institutional login & CR registration' },
  ob_a_sub: { ar: 'دخول آمن عبر البريد المؤسسي والسجل التجاري.', en: 'Secure access via corporate email and commercial registration.' },
  ob_email: { ar: 'البريد المؤسسي', en: 'Corporate email' },
  ob_email_ph: { ar: 'name@company.com.sa', en: 'name@company.com.sa' },
  ob_cr: { ar: 'رقم السجل التجاري', en: 'Commercial registration (CR) number' },
  ob_cr_ph: { ar: '10xxxxxxxx', en: '10xxxxxxxx' },
  ob_login: { ar: 'تسجيل الدخول', en: 'Login' },
  ob_cr_validated: { ar: 'تم التحقق من بيانات السجل التجاري', en: 'CR profile validated' },

  ob_b_title: { ar: 'بناء ملف الشركة الرقمي', en: 'Dynamic company-profile builder' },
  ob_b_sub: { ar: 'يحدّد هذا الملف محرّك المطابقة الآلي للمحتوى المحلي (LCGPA) في «اعتماد» لاحقًا.', en: 'This profile drives the automated LCGPA matching engine in Etimad later on.' },
  ob_sector: { ar: 'القطاع', en: 'Sector' },
  ob_size: { ar: 'حجم المنشأة', en: 'Company size' },
  ob_lc_target: { ar: 'مستهدف المحتوى المحلي', en: 'Local-content target' },
  ob_lc_note: { ar: 'يُحتسب تلقائيًا حسب القطاع وحجم المنشأة.', en: 'Computed automatically from sector and company size.' },

  ob_c_title: { ar: 'مصفوفة باقات الاشتراك الحوكمية', en: 'Governance subscription pricing matrix' },
  ob_c_sub: { ar: 'اختر الباقة التي تناسب حجم منشأتك ومستوى الأتمتة المطلوب.', en: 'Choose the plan that fits your entity size and the automation level you need.' },
  ob_recommended: { ar: 'موصى بها', en: 'Recommended' },
  ob_per_month: { ar: 'ر.س / شهريًا', en: 'SAR / month' },
  ob_select_plan: { ar: 'اختيار الباقة', en: 'Select plan' },
  ob_selected: { ar: 'الباقة المختارة', en: 'Selected' },
  ob_activate: { ar: 'تفعيل الحساب والدخول', en: 'Activate account & enter' },
  ob_need_all: { ar: 'أكمل البريد والسجل التجاري واختيار الباقة للتفعيل.', en: 'Complete email, CR, and plan selection to activate.' },

  size_micro: { ar: 'منشأة متناهية الصغر', en: 'Micro-entity' },
  size_sme: { ar: 'منشأة صغيرة ومتوسطة (SME)', en: 'SME' },
  size_large: { ar: 'شركة كبرى', en: 'Large enterprise' },
}

// Company sectors — bilingual { ar, en } per the official SIDF sector chart.
export const SECTORS = [
  { id: 'engineering', name: { ar: 'الهندسة', en: 'Professional & Engineering' } },
  { id: 'mechanical', name: { ar: 'التوريد الميكانيكي', en: 'Mechanical & Souq Goods' } },
  { id: 'om', name: { ar: 'الصيانة والتشغيل', en: 'O&M (Operations & Maintenance)' } },
  { id: 'it_digital', name: { ar: 'الاتصالات وتقنية المعلومات', en: 'IT & Digital' } },
  { id: 'medical', name: { ar: 'القطاع الطبي والصحي', en: 'Medical & Healthcare' } },
  { id: 'construction', name: { ar: 'المقاولات والإنشاءات', en: 'Construction & Infrastructure' } },
  { id: 'real_estate_valuation', name: { ar: 'التقييم العقاري', en: 'Real Estate Valuation' } },
  { id: 'consulting_services', name: { ar: 'الخدمات الاستشارية', en: 'Consulting Services' } },
]
export const COMPANY_SIZES = [
  { value: 'micro', key: 'size_micro', lcTarget: 40 },
  { value: 'sme', key: 'size_sme', lcTarget: 65 },
  { value: 'large', key: 'size_large', lcTarget: 75 },
]

// Subscription pricing matrix — fully bilingual.
export const SUBSCRIPTION_TIERS = [
  {
    id: 'lean_mvp',
    icon: 'Cpu',
    price: 1500,
    name: { ar: 'الباقة السيادية المستدامة', en: 'Lean MVP Package' },
    tagline: { ar: 'مصمّمة للمنشآت متناهية الصغر', en: 'Tailored for micro-entities' },
    features: [
      { ar: 'تصدير أساسي لجداول WBS وBOQ', en: 'Basic WBS/BOQ exports' },
      { ar: 'تخزين محلي للبيانات', en: 'Local data storage' },
      { ar: 'سجل تدقيق غير قابل للتعديل', en: 'Immutable audit spine' },
    ],
    recommended: false,
  },
  {
    id: 'growth_sme',
    icon: 'Layers',
    price: 4500,
    name: { ar: 'الباقة الذكية للمنشآت المتوسطة', en: 'Growth SME Package' },
    tagline: { ar: 'مصمّمة للمنشآت الصغيرة والمتوسطة', en: 'Tailored for SMEs' },
    features: [
      { ar: 'محرّكات التسعير الذكي', en: 'Smart pricing engines' },
      { ar: 'تنبيهات أداة المحتوى المحلي (LCGPA) الآلية', en: 'Automated LCGPA widget warnings' },
      { ar: 'المطابقة المسبقة المباشرة مع «اعتماد»', en: 'Direct Etimad pre-matching' },
    ],
    recommended: true,
  },
  {
    id: 'enterprise_bimodal',
    icon: 'ShieldCheck',
    price: 12000,
    name: { ar: 'الباقة التكاملية الكبرى', en: 'Enterprise Zero-Touch Gateway' },
    tagline: { ar: 'طبقة تكامل كاملة للشركات الكبرى', en: 'Full integration layer for enterprises' },
    features: [
      { ar: 'تشفير هجين بالذكاء الاصطناعي (Claude/علّام)', en: 'Claude/Allam hybrid-AI encryption' },
      { ar: 'مزامنة تلقائية مع أنظمة ERP', en: 'Automatic ERP systems sync' },
      { ar: 'تقييمات متقدّمة لمخاطر التمويل', en: 'Advanced financing-risk evaluations' },
    ],
    recommended: false,
  },
]

// The 5-step AI-governed procurement & financing workflow (progress bar).
export const STEPS = [
  { n: 1, ar: 'المطابقة والتسعير الذكي', en: 'AI Matching & Pricing' },
  { n: 2, ar: 'الدراسة الذكية والترسية', en: 'AI Study & Award' },
  { n: 3, ar: 'التحقق ورفع المستخلص', en: 'Claim Validation' },
  { n: 4, ar: 'التدقيق الذكي', en: 'Smart Audit' },
  { n: 5, ar: 'التمويل ومحرك الإيراد', en: 'Financing & Revenue' },
]

// Roles for the demo switcher. Default is Sara.
export const ROLES = [
  { id: 'sara', nameAr: 'سارة', nameEn: 'Sara', roleAr: 'المقاول / المورّد', roleEn: 'Contractor / Supplier', initial: 'س', initialEn: 'S' },
  { id: 'khalid', nameAr: 'خالد', nameEn: 'Khalid', roleAr: 'المهندس الحكومي', roleEn: 'Government Engineer', initial: 'خ', initialEn: 'K' },
  { id: 'owner', nameAr: 'الجهة', nameEn: 'Owner', roleAr: 'الجهة الحكومية', roleEn: 'Government Entity', initial: 'ج', initialEn: 'O' },
  { id: 'financier', nameAr: 'المُموّل', nameEn: 'Financier', roleAr: 'تمويل (اختياري)', roleEn: 'Financier (optional)', initial: 'م', initialEn: 'F' },
]

export function lookup(key, lang) {
  const e = DICT[key]
  return e ? e[lang] ?? e.ar : key
}
