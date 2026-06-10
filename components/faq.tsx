'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { Reveal } from './reveal'

const FAQS = [
  {
    q: 'WebGLは重くなりませんか？',
    a: 'スマホでも見やすいように設計し、必要に応じて軽量版や通常表示への切り替えも行います。表示速度は公開前に調整します。',
  },
  {
    q: 'SEOは大丈夫ですか？',
    a: '検索に必要なテキストや構造は、通常のWebサイトとして設計します。演出と検索性は両立できます。',
  },
  {
    q: '普通のホームページも作れますか？',
    a: 'はい。WebGLはあくまで魅力を伝えるための手段です。見やすさ、導線、スマホ対応も含めて制作します。',
  },
  {
    q: '小さなお店でも依頼できますか？',
    a: '可能です。トップページだけ、商品紹介だけなど、規模に合わせて提案できます。',
  },
  {
    q: 'まだ何を作りたいか決まっていなくても相談できますか？',
    a: 'できます。今のお店や会社の魅力、課題、見せたい印象から一緒に整理します。',
  },
]

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
        aria-expanded={open}
      >
        <span className="font-serif text-lg text-foreground md:text-xl">{q}</span>
        <span className="shrink-0 text-muted-foreground">
          {open ? <Minus className="size-5" /> : <Plus className="size-5" />}
        </span>
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="pb-6 text-base leading-relaxed text-muted-foreground">{a}</p>
        </div>
      </div>
    </div>
  )
}

export function Faq() {
  return (
    <section id="faq" className="relative z-20 bg-background py-24 md:py-36">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            FAQ
          </p>
          <h2 className="mt-6 font-serif text-3xl font-medium leading-snug text-foreground md:text-5xl">
            相談の前に、不安をなくす。
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-12">
            {FAQS.map((f) => (
              <Item key={f.q} {...f} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
