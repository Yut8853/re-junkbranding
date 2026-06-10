import { Reveal } from './reveal'

const ITEMS = [
  '料理のこだわり',
  '店内の雰囲気',
  '商品の質感',
  'ブランドの思想',
  '会社の勢い',
  '採用したい空気感',
]

export function Problem() {
  return (
    <section className="theme-midnight relative z-10 py-28 md:py-44">
      <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-10">
        <div className="max-w-3xl rounded-[2rem] border border-white/10 bg-[rgba(6,10,16,0.5)] p-7 shadow-[0_28px_100px_rgba(0,0,0,0.2)] backdrop-blur-md md:p-10">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              伝えたいのに、伝わらないもの
            </p>
            <h2 className="mt-8 max-w-2xl font-serif text-[1.9rem] font-medium leading-[1.4] text-foreground text-balance md:text-4xl md:leading-[1.4]">
              言葉にしづらいものほど、
              <br />
              選ばれる理由になる。
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:mt-20 md:grid-cols-3 md:gap-5">
          {ITEMS.map((item, i) => (
            <Reveal key={item} delay={i * 60}>
              <div className="flex h-full min-h-36 flex-col justify-between rounded-2xl border border-white/10 bg-[rgba(12,16,24,0.58)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-md transition-colors hover:border-accent/60 md:min-h-44 md:p-8">
                <span className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-6 font-serif text-lg text-foreground md:text-xl">
                  {item}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
