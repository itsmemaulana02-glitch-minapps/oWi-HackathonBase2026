'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary"
          >
            <Sparkles className="h-4 w-4" />
            <span>Powered by AI on Base</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="text-balance">
              Tabungan yang{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Melawan Inflasi
              </span>{' '}
              Secara Otomatis
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl"
          >
            Deposit USDT, biarkan AI yang bekerja. OWi secara cerdas mengalokasikan antara stablecoin dan emas digital untuk melindungi nilai uangmu.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link href="/app">
              <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                Mulai Menabung
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Shield className="h-4 w-4" />
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span>Non-Custodial Smart Contract</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>X402 Micropayments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-secondary" />
              <span>Built on Base</span>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 w-full max-w-4xl"
          >
            <div className="relative rounded-2xl border border-border/50 bg-card/50 p-2 backdrop-blur-sm">
              <div className="rounded-xl bg-gradient-to-br from-muted/50 to-muted p-8">
                {/* Mock dashboard preview */}
                <div className="flex flex-col gap-6">
                  {/* Top stats */}
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <StatCard label="Total Value" value="$12,450" change="+5.2%" positive />
                    <StatCard label="USDT" value="$8,200" />
                    <StatCard label="XAUT (Gold)" value="$4,250" change="+2.1%" positive />
                    <StatCard label="AI Trades" value="24" />
                  </div>
                  
                  {/* Chart placeholder */}
                  <div className="h-48 rounded-lg bg-background/50 p-4">
                    <div className="flex h-full items-end justify-between gap-2">
                      {[40, 55, 45, 60, 52, 70, 65, 80, 75, 90, 85, 95].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-gradient-to-t from-primary/50 to-primary"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* AI Decision */}
                  <div className="flex items-center gap-4 rounded-lg bg-primary/10 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">AI Recommendation</p>
                      <p className="text-xs text-muted-foreground">
                        Hold current allocation - Market stable, gold trending up
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-success">92%</p>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function StatCard({ 
  label, 
  value, 
  change, 
  positive 
}: { 
  label: string
  value: string
  change?: string
  positive?: boolean 
}) {
  return (
    <div className="rounded-lg bg-background/50 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        {value}
      </p>
      {change && (
        <p className={`mt-1 text-xs ${positive ? 'text-success' : 'text-destructive'}`}>
          {change}
        </p>
      )}
    </div>
  )
}
