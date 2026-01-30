import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Stats } from '@/components/landing/stats'
import { CTA } from '@/components/landing/cta'
import { Footer } from '@/components/landing/footer'
import { Header } from '@/components/landing/header'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  )
}
