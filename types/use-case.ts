export type Frag =
  | { type: 'reserve' }
  | { type: 'process' }
  | { type: 'profile' }
  | { type: 'gallery' }
  | { type: 'culture' }

export type Category = {
  key: string
  no: string
  tab: string
  industries: string
  photo: string
  accentClass: string
  dot: string
  title: string
  body: string
  frag: Frag
}