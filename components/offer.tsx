import { Reveal } from './reveal'

const SCOPE = [
  '企画',
  '構成',
  'デザイン',
  'WebGL演出',
  '実装',
  'スマホ対応',
  '基本的なSEO設計',
  'お問い合わせ導線',
  '表示速度の調整',
  '公開後の調整',
]

export function Offer() {
  return (
    <section className="relative z-20 border-t border-border bg-background py-28 md:py-44">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="grid gap-14 md:grid-cols-[1fr_1.1fr] md:gap-20">
          <Reveal>
            <div className="md:sticky md:top-28">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                What we make
              </p>
              <h2 className="mt-8 font-serif text-[1.9rem] font-medium leading-[1.4] text-foreground text-balance md:text-4xl md:leading-[1.4]">
                演出だけでなく、
                <br />
                サイトとして
                <br />
                必要なものまで。
              </h2>
              <p className="mt-8 max-w-sm text-base leading-loose text-muted-foreground">
                スマホ対応も、問い合わせ導線も、表示速度も。すべて含めて設計します。
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <ul className="grid grid-cols-2 gap-3 md:gap-4">
              {SCOPE.map((s, i) => (
                <li
                  key={s}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background px-5 py-5 md:px-6 md:py-6"
                >
                  <span className="font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-foreground md:text-base">{s}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
