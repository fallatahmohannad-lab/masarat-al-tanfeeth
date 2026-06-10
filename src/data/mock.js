// Realistic Saudi mock data for the Masaraat clickable prototype.
// Plain-language only — no internal engine names appear here.

export const RFP = {
  ref: 'RFP-4827-1446',
  titleAr: 'صيانة وتشغيل مرافق إدارية — جدة',
  titleEn: 'Administrative facilities O&M — Jeddah',
  ownerAr: 'أمانة محافظة جدة',
  ownerEn: 'Jeddah Municipality',
  locationAr: 'جدة، المملكة العربية السعودية',
  locationEn: 'Jeddah, Saudi Arabia',
  value: 4_180_000, // SAR
  dueInDays: 6,
  contractorAr: 'شركة مسارات الإعمار للمقاولات',
  contractorEn: 'Masarat Construction Co.',
}

// Step 1 · Price it — smart price suggestion + low-price warning.
// `low` is flagged when the entered price is >25% below the suggested price.
export const PRICE_ITEMS = [
  { id: 'P1', nameAr: 'صيانة دورية وقائية', nameEn: 'Preventive maintenance', unitAr: 'زيارة', unitEn: 'visit', qty: 240, suggested: 1200, entered: 1150 },
  { id: 'P2', nameAr: 'خدمة وصيانة التكييف', nameEn: 'HVAC service', unitAr: 'وحدة', unitEn: 'unit', qty: 30, suggested: 78000, entered: 55000 },
  { id: 'P3', nameAr: 'أعمال كهربائية', nameEn: 'Electrical works', unitAr: 'م.ط', unitEn: 'l.m', qty: 1400, suggested: 95, entered: 92 },
]

// Step 1 · Plan it — auto-created milestone checklist.
export const MILESTONES = [
  { id: 'M1', nameAr: 'التعبئة والتجهيز', nameEn: 'Mobilization', weight: 10, amount: 418000 },
  { id: 'M2', nameAr: 'صيانة المباني', nameEn: 'Building maintenance', weight: 35, amount: 1463000 },
  { id: 'M3', nameAr: 'أعمال التكييف', nameEn: 'HVAC works', weight: 30, amount: 1254000 },
  { id: 'M4', nameAr: 'التسليم النهائي', nameEn: 'Final handover', weight: 25, amount: 1045000 },
]

// Step 3 · a change request raised during the work.
export const CHANGE_REQUEST = {
  id: 'CR-07',
  titleAr: 'إضافة مبنى جديد إلى نطاق الصيانة',
  titleEn: 'Add a new building to the maintenance scope',
  impacts: [
    { kind: 'scope', ar: 'النطاق', en: 'Scope', deltaAr: 'مبنى إضافي', deltaEn: '+1 building' },
    { kind: 'spec', ar: 'المواصفات', en: 'Spec', deltaAr: 'بدون تغيير', deltaEn: 'No change' },
    { kind: 'schedule', ar: 'الجدول', en: 'Schedule', deltaAr: '+14 يومًا', deltaEn: '+14 days' },
    { kind: 'local', ar: 'المحتوى المحلي', en: 'Local content', deltaAr: '+3%', deltaEn: '+3%' },
  ],
  costImpact: 286000,
  signers: ['khalid', 'owner'],
}

// Step 3 · quantity check — one mismatch to resolve.
export const QTY_CHECK = [
  { id: 'M1', orderedAr: 'التعبئة والتجهيز', orderedEn: 'Mobilization', ordered: 1, delivered: 1 },
  { id: 'M2', orderedAr: 'صيانة المباني', orderedEn: 'Building maintenance', ordered: 1, delivered: 1 },
  { id: 'M3', orderedAr: 'أعمال التكييف', orderedEn: 'HVAC works', ordered: 30, delivered: 28 }, // mismatch
]

export const LOCAL_CONTENT = {
  score: 62, // %
  threshold: 40,
}

export const DASHBOARD = {
  daysToPayment: 14,
  daysLate: 2,
  dailyDelayCost: 4500,
  localContentScore: 62,
}

export const fmtSAR = (n) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)
