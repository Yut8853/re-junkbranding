// Shared navigation model so the header, side progress nav, and scrollspy
// all reference the same section ids and order.

export type NavStep = {
  id: string
  no: string
  en: string
  ja: string
  /** show in the top header nav */
  header?: boolean
}

export const NAV_STEPS: NavStep[] = [
  { id: 'experience', no: '01', en: 'Enter', ja: '体験', header: true },
  { id: 'meaning', no: '02', en: 'Meaning', ja: '意味' },
  { id: 'problem', no: '03', en: 'Issue', ja: '課題', header: true },
  { id: 'transformation', no: '04', en: 'Transform', ja: '変化', header: true },
  { id: 'usecase', no: '05', en: 'Use Case', ja: '事例', header: true },
  { id: 'plan', no: '06', en: 'Plan', ja: 'プラン', header: true },
  { id: 'contact', no: '07', en: 'Contact', ja: '相談', header: true },
]

// FAQ isn't a journey step but is reachable from the header.
export const HEADER_EXTRA: NavStep[] = [
  { id: 'faq', no: '', en: 'FAQ', ja: 'FAQ', header: true },
]
