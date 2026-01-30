'use client'

import { motion } from 'framer-motion'

const stats = [
  { value: '$0', label: 'Total Value Locked', suffix: '' },
  { value: '0', label: 'Active Users', suffix: '+' },
  { value: '0', label: 'AI Decisions Made', suffix: '+' },
  { value: '0%', label: 'Avg. Returns vs Inflation', suffix: '' },
]

export function Stats() {
  return (
    <section className="border-y border-border/50 bg-muted/30 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <p 
                className="text-3xl font-bold text-primary md:text-4xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {stat.value}{stat.suffix}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
