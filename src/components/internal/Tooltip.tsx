'use client'

import { useEffect, useState } from 'react'
import { priceLabel } from '@/lib/internal/city'
import type { City, Hover } from '@/lib/internal/types'
import styles from './Tooltip.module.css'

export default function Tooltip({ city, hover }: { city: City; hover: Hover }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const move = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])
  useEffect(() => {
    if (!hover) return
    const previous = document.body.style.cursor
    document.body.style.cursor = 'pointer'
    return () => {
      document.body.style.cursor = previous
    }
  }, [hover])
  if (!hover) return null

  const left = Math.min(pos.x + 18, window.innerWidth - 300)
  const top = Math.min(pos.y + 18, window.innerHeight - 340)

  if (hover.type === 'clinic') {
    const c = city.clinicById[hover.id]
    if (!c) return null
    return (
      <div className={styles.tip} style={{ left, top }}>
        <h2>{c.name}</h2>
        <div className={styles.sub}>{[c.kind?.replaceAll('_', ' '), c.city, c.region].filter(Boolean).join(' · ')}</div>
        {c.address && <div>{c.address}</div>}
        {c.phone && <div>{c.phone}</div>}
        {c.website && <div>{c.website.replace('https://', '')}</div>}
        <h3>Doctors ({c.doctors.length})</h3>
        <ul>
          {c.doctors.map((d) => (
            <li key={d.id}>
              <span>{d.name}</span>
              <span>{d.specialty}</span>
            </li>
          ))}
        </ul>
        <h3>Prices</h3>
        <ul>
          {c.prices.map((p) => (
            <li key={p.procedureId} className={p.best ? styles.best : undefined}>
              <span>{p.name}</span>
              <span>
                {priceLabel(p)}
                {p.best ? ' ★' : ''}
              </span>
            </li>
          ))}
        </ul>
        <div className={styles.note}>★ cheapest across all clinics</div>
      </div>
    )
  }

  const d = city.docById[hover.id]
  if (!d) return null
  return (
    <div className={styles.tip} style={{ left, top }}>
      <h2>
        {d.name}
        {d.credentials ? `, ${d.credentials}` : ''}
      </h2>
      <div className={styles.sub}>{d.specialty}</div>
      {d.languages && d.languages.length > 0 && <div>Speaks: {d.languages.join(', ')}</div>}
      <h3>Affiliated clinics</h3>
      <ul>
        {d.clinics.map((c) => (
          <li key={c.id}>
            <span>{c.name}</span>
            <span>{c.city}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
