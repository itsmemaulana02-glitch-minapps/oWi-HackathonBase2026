'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-card to-secondary/20 p-8 md:p-16"
        >
          {/* Background decorations */}
          <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />

          <div className="relative text-center">
            <h2 
              className="text-3xl font-bold md:text-5xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="text-balance">
                Mulai Lindungi Tabunganmu{' '}
                <span className="text-primary">Sekarang</span>
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-muted-foreground">
              Tidak perlu ribet. Connect wallet, deposit, dan biarkan AI yang bekerja. 
              Join ratusan pengguna yang sudah mempercayakan tabungan mereka ke OWi.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/app">
                <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  Launch App
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                No minimum deposit required
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
