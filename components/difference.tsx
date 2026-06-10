import { Reveal } from './reveal'

export function Difference() {
  return (
    <section className="relative z-20 border-t border-border bg-background py-28 md:py-44">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Video vs. Interactive
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-8 font-serif text-[1.9rem] font-medium leading-[1.4] text-foreground text-balance md:text-5xl md:leading-[1.35]">
            動画は、見るもの。
            <br />
            体験型サイトは、触れるもの。
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-5 md:mt-20 md:grid-cols-2 md:gap-6">
          <Reveal delay={120}>
            <div className="flex h-full flex-col rounded-2xl border border-border p-8 md:p-10">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                動画 / Video
              </span>
              <p className="mt-8 font-serif text-xl text-foreground md:text-2xl">
                一方通行で「見る」
              </p>
              <p className="mt-4 text-sm leading-loose text-muted-foreground md:text-base">
                決められた流れを、ただ眺めるだけ。
              </p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex h-full flex-col rounded-2xl border border-accent/40 bg-accent/5 p-8 md:p-10">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                WebGL / Interactive
              </span>
              <p className="mt-8 font-serif text-xl text-foreground md:text-2xl">
                自分の手で「触れる」
              </p>
              <p className="mt-4 text-sm leading-loose text-muted-foreground md:text-base">
                スクロールやタップに反応し、ユーザー自身が
                触れながら世界観を理解できる。
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <p className="mt-12 max-w-2xl text-sm leading-loose text-muted-foreground">
            ※ WebGL とは、ブラウザ上でリッチな3D表現を実現する技術です。アプリのインストールは不要です。
          </p>
        </Reveal>
      </div>
    </section>
  )
}
