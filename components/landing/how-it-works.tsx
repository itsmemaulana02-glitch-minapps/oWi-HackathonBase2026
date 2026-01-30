'use client'

import { motion } from 'framer-motion'
import { Wallet, Bot, ArrowLeftRight, TrendingUp } from 'lucide-react'

const steps = [
  {
    icon: Wallet,
    step: '01',
    title: 'Connect & Deposit',
    description: 'Hubungkan wallet Base kamu dan deposit USDT. Minimum deposit hanya $10.',
  },
  {
    icon: Bot,
    step: '02',
    title: 'AI Monitors Market',
    description: 'AI kami menganalisis harga emas, inflasi, dan sentimen pasar secara real-time.',
  },
  {
    icon: ArrowLeftRight,
    step: '03',
    title: 'Auto Swap',
    description: 'Ketika kondisi optimal, AI akan swap antara USDT dan XAUT untuk melindungi nilaimu.',
  },
  {
    icon: TrendingUp,
    step: '04',
    title: 'Grow Your Savings',
    description: 'Tabunganmu terlindungi dari inflasi dan berkembang seiring waktu.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/30 py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium uppercase tracking-wider text-primary"
          >
            How it Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Simpel, Transparan, Aman
          </motion.h2>
        </div>

        <div className="relative mt-16">
          {/* Connection line */}
          <div className="absolute top-24 left-0 hidden h-0.5 w-full bg-gradient-to-r from-transparent via-border to-transparent md:block" />

          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Step number badge */}
                <div className="relative mx-auto mb-6 flex h-12 w-12 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-primary/20" />
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-background text-sm font-bold text-primary">
                    {step.step}
                  </div>
                </div>

                {/* Icon */}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-card">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
