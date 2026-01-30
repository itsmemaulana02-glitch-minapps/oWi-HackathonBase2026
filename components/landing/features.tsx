'use client'

import { motion } from 'framer-motion'
import { Brain, Shield, Coins, Zap, Eye, Lock } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Decisions',
    description: 'Algoritma cerdas menganalisis pasar 24/7 dan membuat keputusan swap optimal antara USDT dan Gold.',
  },
  {
    icon: Shield,
    title: 'Anti-Inflasi',
    description: 'Lindungi nilai tabunganmu dari inflasi dengan alokasi dinamis ke emas digital (XAUT).',
  },
  {
    icon: Coins,
    title: 'Low Risk Strategy',
    description: 'Hanya USDT dan XAUT - dua aset paling stabil untuk meminimalkan volatilitas portofolio.',
  },
  {
    icon: Zap,
    title: 'X402 Micropayments',
    description: 'Bayar hanya untuk keputusan AI yang kamu gunakan dengan protokol pembayaran X402.',
  },
  {
    icon: Eye,
    title: 'Transparansi Penuh',
    description: 'Setiap keputusan AI dijelaskan dengan reasoning lengkap. Tidak ada black box.',
  },
  {
    icon: Lock,
    title: 'Non-Custodial',
    description: 'Dana kamu tetap di wallet sendiri. Smart contract hanya mengeksekusi swap yang disetujui.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium uppercase tracking-wider text-primary"
          >
            Features
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Kenapa OWi?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-muted-foreground"
          >
            Tabungan pintar yang bekerja untukmu, bukan sebaliknya.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/50 hover:bg-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
