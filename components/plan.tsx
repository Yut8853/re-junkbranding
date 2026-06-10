import { Reveal } from './reveal'
import { cn } from '@/lib/utils'
import type { Tier } from '@/types/plan'

const PLANS: {
  name: string
  tier: Tier
  desc: string
  forWho: string
  featured: boolean
}[] = [
  {
    name: 'Light',
    tier: 'light',
    desc: 'トップページや一部セクションに、印象的な3D・アニメーション演出を加えるプラン。',
    forWho: 'まずは普通のHPとの差を出したい店舗・ブランド向け。',
    featured: false,
  },
  {
    name: 'Standard',
    tier: 'standard',
    desc: '構成、デザイン、実装、演出まで含めて制作する基本プラン。',
    forWho: '店舗サイト、コーポレートサイト、サービスサイト向け。',
    featured: true,
  },
  {
    name: 'Premium',
    tier: 'premium',
    desc: 'WebGLを中心に、独自の体験設計を行うプラン。',
    forWho: 'ブランドサイト、採用サイト、キャンペーンサイト向け。',
    featured: false,
  },
]

const CARD: Record<Tier, string> = {
  light: 'border-border bg-background',
  standard: 'theme-navy border-transparent bg-background shadow-2xl',
  premium:
    'border-[color-mix(in_oklch,oklch(0.62_0.16_295)_45%,transparent)] bg-[color-mix(in_oklch,oklch(0.62_0.16_295)_7%,var(--background))]',
}

export function Plan() {
  return (
    <section id="plan" className="relative z-20 border-t border-border bg-background py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Plans
          </p>
          <h2 className="mt-6 font-serif text-3xl font-medium leading-snug text-foreground text-balance md:text-5xl">
            目的に合わせて、規模を選ぶ。
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PLANS.map((p, i) => {
            const isNavy = p.tier === 'standard'
            const isPremium = p.tier === 'premium'
            return (
              <Reveal key={p.name} delay={i * 90}>
                <div
                  className={cn(
                    'flex h-full flex-col rounded-2xl border p-8',
                    p.featured && 'md:-mt-4 md:pb-12',
                    CARD[p.tier],
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl font-medium text-foreground">
                      {p.name}
                    </h3>
                    {p.featured && (
                      <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-medium text-accent-foreground">
                        人気
                      </span>
                    )}
                    {isPremium && (
                      <span
                        className="rounded-full px-3 py-1 text-[11px] font-medium text-background"
                        style={{ background: 'oklch(0.62 0.16 295)' }}
                      >
                        最上位
                      </span>
                    )}
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                  <div className="mt-6 border-t border-border pt-6">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      向いている人
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">
                      {p.forWho}
                    </p>
                  </div>
                  <a
                    href="#contact"
                    className={cn(
                      'mt-8 rounded-full px-5 py-3 text-center text-sm font-medium transition-opacity hover:opacity-85',
                      isNavy
                        ? 'bg-accent text-accent-foreground'
                        : isPremium
                          ? 'text-background'
                          : 'bg-foreground text-background',
                    )}
                    style={
                      isPremium ? { background: 'oklch(0.62 0.16 295)' } : undefined
                    }
                  >
                    このプランで相談
                  </a>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={120}>
          <p className="mt-10 text-center text-sm leading-relaxed text-muted-foreground">
            ご予算や目的に合わせて、小さな演出からご提案できます。まずはお気軽にご相談ください。
          </p>
        </Reveal>
      </div>
    </section>
  )
}
