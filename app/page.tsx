import { SiteHeader } from '@/components/site-header'
import { SideProgress } from '@/components/side-progress'
import { FixedWebGLBackground } from '@/components/fixed-webgl-background'
import { Hero } from '@/components/hero'
import { Bridge } from '@/components/bridge'
import { Hook } from '@/components/hook'
import { Problem } from '@/components/problem'
import { Transformation } from '@/components/transformation'
import { Difference } from '@/components/difference'
import { UseCase } from '@/components/use-case'
import { Offer } from '@/components/offer'
import { SmallStart } from '@/components/small-start'
import { Plan } from '@/components/plan'
import { Faq } from '@/components/faq'
import { Contact, SiteFooter } from '@/components/contact'

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[oklch(0.17_0.03_258)]">
      <FixedWebGLBackground />
      <div className="relative z-10">
        <SiteHeader />
        <SideProgress />
        <Hero />
        <Bridge overlay />
        <Hook />
        <Problem />
        <Transformation />
        <Difference />
        <UseCase />
        <Offer />
        <SmallStart />
        <Plan />
        <Faq />
        <Contact />
        <SiteFooter />
      </div>
    </main>
  )
}
