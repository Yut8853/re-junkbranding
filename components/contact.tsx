'use client'

import { useState } from 'react'
import { Reveal } from './reveal'
import { cn } from '@/lib/utils'
import { navClick } from '@/lib/scroll-to'

const INTENTS = [
  {
    key: 'store',
    label: '店舗の世界観を伝えたい',
    photo: '/jp/salon.png',
    seed: '店舗の世界観や空気感を、体験として伝えたいです。',
  },
  {
    key: 'product',
    label: '商品・サービスを印象的に見せたい',
    photo: '/jp/product.png',
    seed: '商品・サービスの魅力を、印象的に体験で見せたいです。',
  },
  {
    key: 'recruit',
    label: '採用・企業イメージを強くしたい',
    photo: '/jp/company.png',
    seed: '採用・企業イメージを、体験を通じて強くしたいです。',
  },
  {
    key: 'unsure',
    label: 'まだ決まっていないので相談したい',
    photo: '/jp/cafe.png',
    seed: 'まだ具体的には決まっていません。まずは相談させてください。',
  },
] as const

export function Contact() {
  const [intent, setIntent] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const choose = (key: string, seed: string) => {
    setIntent(key)
    setMessage(seed)
    // move focus into the form for a natural hand-off
    requestAnimationFrame(() => {
      document
        .getElementById('contact-form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const mailto = `mailto:hello@tsutawaru.studio?subject=${encodeURIComponent(
    '体験型サイトの相談',
  )}&body=${encodeURIComponent(message || '')}`

  return (
    <section
      id="contact"
      className="theme-navy relative z-20 overflow-hidden py-28 md:py-44"
    >
      <div className="relative z-10 mx-auto max-w-3xl px-6 md:px-10">
        {/* CTA Landing: name the intent before the form */}
        <Reveal>
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.35em] text-accent">
            07 — Contact
          </p>
          <h2 className="mt-8 text-center font-serif text-[1.9rem] font-medium leading-[1.4] text-foreground text-balance md:text-5xl md:leading-[1.35]">
            どんな魅力を、
            <br className="hidden md:block" />
            体験に変えたいですか？
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12 grid gap-3 md:grid-cols-2">
            {INTENTS.map((it) => {
              const selected = intent === it.key
              return (
                <button
                  key={it.key}
                  type="button"
                  onClick={() => choose(it.key, it.seed)}
                  aria-pressed={selected}
                  className={cn(
                    'flex items-center gap-4 rounded-2xl border px-4 py-4 text-left text-sm transition-all md:text-base',
                    selected
                      ? 'border-accent bg-accent/10 text-foreground'
                      : 'border-border bg-background/70 text-muted-foreground hover:border-foreground/40 hover:text-foreground',
                  )}
                >
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={it.photo || '/placeholder.svg'}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0"
                      style={{ background: 'rgba(15,18,28,0.25)' }}
                    />
                  </span>
                  <span className="flex-1">{it.label}</span>
                  <span
                    className={cn(
                      'h-2.5 w-2.5 shrink-0 rounded-full transition-colors',
                      selected ? 'bg-accent' : 'bg-foreground/20',
                    )}
                  />
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Form: reflects the chosen intent */}
        <Reveal delay={180}>
          <form
            id="contact-form"
            action={mailto}
            method="get"
            className="mt-10 rounded-3xl border border-border bg-background/80 p-7 backdrop-blur-sm md:p-10"
          >
            <label className="block">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                相談内容
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="伝えたい魅力や、今のお悩みを自由にお書きください。"
                className="mt-3 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-base leading-loose text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent"
              />
            </label>

            <div className="mt-8 flex flex-col items-center gap-4">
              <a
                href={mailto}
                className="w-full rounded-full bg-foreground px-8 py-4 text-center text-sm font-medium text-background transition-opacity hover:opacity-85 md:w-auto md:px-12"
              >
                この内容で相談する
              </a>
              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                具体的なイメージがなくても大丈夫です。まずは、見せたい世界観からお聞きします。
              </p>
            </div>
          </form>
        </Reveal>

        {/* replay the experience */}
        <Reveal delay={220}>
          <div className="mt-12 text-center">
            <a
              href="#experience"
              onClick={navClick('experience')}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="h-px w-6 bg-foreground/30" />
              もう一度、体験を見る
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="relative z-20 border-t border-border bg-background py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row md:px-10">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-lg font-semibold text-foreground">伝わる</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Studio
          </span>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          体験で魅力を伝えるWebサイト制作
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} Tsutawaru Studio
        </p>
      </div>
    </footer>
  )
}
