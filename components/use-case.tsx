'use client'

import { useState } from 'react'
import { Reveal } from './reveal'
import { cn } from '@/lib/utils'
import type { Category, Frag } from '@/types/use-case'

/**
 * UseCase — a showcase, not a photo grid.
 *
 * Five categories, each selectable. Choosing one swaps a large lead photo,
 * tailored copy, the industries it covers, AND a floating "web experience"
 * fragment overlaid on the photo — so the user sees how the *presentation*
 * itself changes per category, not just the picture. Stacks vertically and
 * reads naturally on mobile.
 */

const CATEGORIES: Category[] = [
  {
    key: 'space',
    no: '01',
    tab: '店舗・空間',
    industries: '飲食店 / 美容室 / クリニック / 不動産',
    photo: '/jp/cafe.png',
    accentClass: 'accent-amber',
    dot: 'oklch(0.72 0.14 55)',
    title: '空気感で、選ばれる。',
    body: 'できたての湯気、店内の灯り、流れる時間。来店前から世界観を感じてもらい、価格ではなく雰囲気で選ばれる入口をつくります。',
    frag: { type: 'reserve' },
  },
  {
    key: 'craft',
    no: '02',
    tab: '技術・ものづくり',
    industries: '工場 / 農業 / 職人 / 建築',
    photo: '/jp/craft.png',
    accentClass: 'accent-navy',
    dot: 'oklch(0.55 0.09 255)',
    title: '工程が、信頼になる。',
    body: '手の動き、精度、こだわりの一手間。言葉にしづらい技術力を、見てわかる工程として届け、確かな信頼に変えます。',
    frag: { type: 'process' },
  },
  {
    key: 'trust',
    no: '03',
    tab: '信頼・専門職',
    industries: '医師 / 士業 / コンサル / 教育',
    photo: '/jp/trust.png',
    accentClass: 'accent-cyan',
    dot: 'oklch(0.68 0.12 220)',
    title: '専門性を、話しかけやすく。',
    body: '確かな実績と、相談しやすい雰囲気の両立。難しそうな印象を、安心して任せたくなる距離感に整えます。',
    frag: { type: 'profile' },
  },
  {
    key: 'personal',
    no: '04',
    tab: '個人ブランド',
    industries: 'カメラマン / モデル / インフルエンサー / 講師',
    photo: '/jp/personal.png',
    accentClass: 'accent-violet',
    dot: 'oklch(0.62 0.16 295)',
    title: '世界観で、記憶に残す。',
    body: '作品の空気、人の個性、表現の温度。ポートフォリオを、スクロールするほど引き込まれる体験として見せます。',
    frag: { type: 'gallery' },
  },
  {
    key: 'company',
    no: '05',
    tab: '企業・採用',
    industries: 'コーポレート / 採用 / BtoB / スタートアップ',
    photo: '/jp/company.png',
    accentClass: 'accent-pink',
    dot: 'oklch(0.7 0.13 350)',
    title: '働く空気を、伝える。',
    body: 'チームの表情、職場の温度、向かう先。条件だけでは伝わらない「ここで働きたい」を、体験として生み出します。',
    frag: { type: 'culture' },
  },
]

export function UseCase() {
  const [active, setActive] = useState(0)
  const c = CATEGORIES[active]

  return (
    <section
      id="usecase"
      className="theme-midnight relative z-10 py-28 md:py-40"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Use Cases
          </p>
          <h2 className="mt-8 font-serif text-[1.9rem] font-medium leading-[1.4] text-foreground text-balance md:text-5xl md:leading-[1.35]">
            業種ごとに、
            <br className="hidden md:block" />
            伝えるべき魅力は違います。
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-loose text-muted-foreground md:text-lg">
            料理の質感、空間の空気感、技術の工程、人の信頼感、土地の物語。その業種にしかない魅力を、写真・動き・奥行きで伝わるWeb体験にします。
          </p>
        </Reveal>

        {/* category selector */}
        <Reveal delay={120}>
          <div
            role="tablist"
            aria-label="業種カテゴリー"
            className="mt-14 flex flex-wrap gap-2 border-b border-border pb-4"
          >
            {CATEGORIES.map((cat, i) => {
              const on = i === active
              return (
                <button
                  key={cat.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={cn(
                    'flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors',
                    on
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:bg-background hover:text-foreground',
                  )}
                >
                  <span className="font-mono text-[10px] opacity-60">
                    {cat.no}
                  </span>
                  {cat.tab}
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* showcase */}
        <div
          className={cn(
            c.accentClass,
            'mt-10 grid items-stretch gap-8 lg:grid-cols-[1.15fr_1fr]',
          )}
        >
          {/* lead photo + floating web fragment */}
          <div
            key={`${c.key}-photo`}
            className="animate-fade-up relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-auto"
            style={{ boxShadow: `0 40px 90px -50px ${c.dot}` }}
          >
            <img
              src={c.photo || '/placeholder.svg'}
              alt={`${c.tab}のイメージ`}
              className="absolute inset-0 h-full w-full object-cover"
              decoding="async"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(15,18,28,0.65), rgba(15,18,28,0.05) 55%)',
              }}
            />
            {/* accent bloom */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `radial-gradient(110% 80% at 85% 5%, ${c.dot}, transparent 55%)`,
                mixBlendMode: 'soft-light',
                opacity: 0.9,
              }}
            />
            {/* the web-experience fragment overlaid on the photo */}
            <div className="absolute bottom-5 left-5 right-5 md:bottom-7 md:left-7 md:right-auto md:w-[20rem]">
              <Fragment frag={c.frag} dot={c.dot} />
            </div>
          </div>

          {/* copy */}
          <div
            key={`${c.key}-copy`}
            className="animate-fade-up flex flex-col justify-center"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: c.dot }}
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                {c.tab}
              </span>
            </div>
            <h3 className="mt-5 font-serif text-3xl font-medium leading-tight text-foreground text-balance md:text-4xl">
              {c.title}
            </h3>
            <p className="mt-6 text-base leading-loose text-muted-foreground">
              {c.body}
            </p>
            <div className="mt-8 border-t border-border pt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Covers
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {c.industries}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- the per-category web-experience fragment ---------- */

function Fragment({ frag, dot }: { frag: Frag; dot: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/95 p-4 shadow-2xl backdrop-blur">
      {/* tiny browser chrome */}
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#e7948a]" />
        <span className="h-2 w-2 rounded-full bg-[#e7c188]" />
        <span className="h-2 w-2 rounded-full bg-[#9fc79a]" />
      </div>
      {frag.type === 'reserve' && <FragReserve dot={dot} />}
      {frag.type === 'process' && <FragProcess dot={dot} />}
      {frag.type === 'profile' && <FragProfile dot={dot} />}
      {frag.type === 'gallery' && <FragGallery dot={dot} />}
      {frag.type === 'culture' && <FragCulture dot={dot} />}
    </div>
  )
}

const ink = 'text-[#2a2620]'
const sub = 'text-[#2a2620]/55'

function FragReserve({ dot }: { dot: string }) {
  return (
    <div>
      <p className={cn('text-xs font-medium', ink)}>本日の予約</p>
      <div className="mt-2 flex gap-1.5">
        {['11:30', '13:00', '18:00', '19:30'].map((t, i) => (
          <span
            key={t}
            className="rounded-md px-2 py-1 text-[10px]"
            style={
              i === 2
                ? { background: dot, color: '#fff' }
                : { background: 'rgba(42,38,32,0.06)', color: 'rgba(42,38,32,0.6)' }
            }
          >
            {t}
          </span>
        ))}
      </div>
      <div
        className="mt-3 rounded-lg py-2 text-center text-[11px] font-medium text-white"
        style={{ background: dot }}
      >
        席を予約する
      </div>
    </div>
  )
}

function FragProcess({ dot }: { dot: string }) {
  const steps = ['素材', '加工', '仕上げ', '検品']
  return (
    <div>
      <p className={cn('text-xs font-medium', ink)}>製造の工程</p>
      <div className="mt-3 flex items-center">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-medium text-white"
                style={{ background: dot }}
              >
                {i + 1}
              </span>
              <span className={cn('text-[9px]', sub)}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <span className="mx-1 h-px flex-1" style={{ background: dot, opacity: 0.4 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function FragProfile({ dot }: { dot: string }) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold text-white"
          style={{ background: dot }}
        >
          専
        </span>
        <div>
          <p className={cn('text-xs font-medium', ink)}>確かな実績で支えます</p>
          <p className={cn('text-[10px]', sub)}>相談実績 1,200件 / 解決率 98%</p>
        </div>
      </div>
      <div
        className="mt-3 rounded-lg border py-1.5 text-center text-[11px] font-medium"
        style={{ borderColor: dot, color: dot }}
      >
        無料で相談する
      </div>
    </div>
  )
}

function FragGallery({ dot }: { dot: string }) {
  return (
    <div>
      <p className={cn('text-xs font-medium', ink)}>Works</p>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="aspect-square rounded-md"
            style={{
              background:
                i === 1
                  ? dot
                  : `rgba(42,38,32,${0.06 + (i % 3) * 0.05})`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function FragCulture({ dot }: { dot: string }) {
  return (
    <div>
      <p className={cn('text-xs font-medium', ink)}>私たちの今</p>
      <div className="mt-2 flex gap-4">
        <div>
          <p className="text-lg font-semibold leading-none" style={{ color: dot }}>
            42
          </p>
          <p className={cn('text-[9px]', sub)}>メンバー</p>
        </div>
        <div>
          <p className="text-lg font-semibold leading-none" style={{ color: dot }}>
            8
          </p>
          <p className={cn('text-[9px]', sub)}>職種</p>
        </div>
        <div>
          <p className="text-lg font-semibold leading-none" style={{ color: dot }}>
            96%
          </p>
          <p className={cn('text-[9px]', sub)}>定着率</p>
        </div>
      </div>
    </div>
  )
}
