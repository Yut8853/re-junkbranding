import { Reveal } from './reveal'

export function SmallStart() {
  return (
    <section className="relative z-20 bg-background py-28 md:py-44">
      <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Small Start
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-8 font-serif text-[1.9rem] font-medium leading-[1.4] text-foreground text-balance md:text-5xl md:leading-[1.35]">
            全部を、特別に
            <br />
            する必要はありません。
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-10 max-w-md text-base leading-loose text-muted-foreground md:text-lg">
            いちばん伝えたい一か所だけ。
            費用も速度もバランスを取りながら、小さく始められます。
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {['ファーストビューだけ', '商品紹介だけ', '採用ページだけ'].map((t) => (
              <span
                key={t}
                className="rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
