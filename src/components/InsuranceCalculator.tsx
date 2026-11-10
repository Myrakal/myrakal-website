'use client'

import { useState } from 'react'

const FIELDS = [
  ['quote', 'Your quote total', '$', '30000'],
  ['max', 'Annual maximum left this year', '$', '1500'],
  ['coverage', 'Coverage for major work', '%', '50'],
  ['deductible', 'Deductible left', '$', '50'],
] as const

type Key = (typeof FIELDS)[number][0]

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function amount(value: string) {
  const n = Number(value.replace(/[$,%\s]/g, ''))
  return Number.isFinite(n) && n > 0 ? n : 0
}

export function InsuranceCalculator() {
  const [values, setValues] = useState<Record<Key, string>>(
    Object.fromEntries(FIELDS.map(([key, , , initial]) => [key, initial])) as Record<Key, string>,
  )
  const quote = amount(values.quote)
  const coverage = Math.min(100, amount(values.coverage))
  const pays = Math.min(amount(values.max), Math.max(0, quote - amount(values.deductible)) * (coverage / 100))
  const share = quote > 0 ? Math.round((pays / quote) * 100) : 0
  return (
    <div className="grid w-full gap-px bg-rule md:grid-cols-2">
      <div className="flex flex-col gap-6 bg-ink p-8 text-left sm:p-10">
        {FIELDS.map(([key, label, unit]) => (
          <div key={key} className="flex flex-col gap-2">
            <label htmlFor={key} className="font-caslon text-xs tracking-[0.2em] text-mist uppercase">
              {label} ({unit})
            </label>
            <input
              id={key}
              type="text"
              inputMode="numeric"
              value={values[key]}
              onChange={(e) => setValues({ ...values, [key]: e.target.value })}
              className="border border-rule bg-charcoal px-4 py-3 font-caslon text-lg text-cream focus-visible:outline-2 focus-visible:outline-champagne"
            />
          </div>
        ))}
      </div>
      <div aria-live="polite" className="flex flex-col justify-center gap-8 bg-ink p-8 text-center sm:p-10">
        {[
          ['pays', 'Insurance pays', pays],
          ['you', 'You pay', quote - pays],
        ].map(([id, label, value]) => (
          <div key={id} className="flex flex-col gap-2">
            <p id={`${id}-label`} className="font-caslon text-xs tracking-[0.32em] text-champagne uppercase">
              {label}
            </p>
            <output aria-labelledby={`${id}-label`} className="font-display text-5xl text-cream sm:text-6xl">
              {usd.format(Number(value))}
            </output>
          </div>
        ))}
        <p className="font-caslon text-lg text-mist">Insurance covers {share}% of this quote.</p>
      </div>
    </div>
  )
}
