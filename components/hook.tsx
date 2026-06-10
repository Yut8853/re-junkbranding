import { Reveal } from './reveal'

export function Hook() {
  return (
    <section
      id="problem"
      className="theme-navy relative z-10 py-28 md:py-44"
    >
      <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-10">
        <div className="max-w-3xl">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              03 — Issue
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-10 font-serif text-[2rem] font-medium leading-[1.4] text-foreground text-balance md:text-5xl md:leading-[1.4]">
              いいお店なのに、
              <br />
              それが画面では伝わらない。
            </h2>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-16 max-w-md border-l-2 border-accent pl-6 md:pl-8">
              <p className="text-base leading-loose text-muted-foreground md:text-lg">
                写真と文章を並べても、
                <span className="text-foreground">いちばん伝えたい空気感</span>
                は、こぼれ落ちてしまう。
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
