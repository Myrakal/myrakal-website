'use client'

import { useMemo, useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

import { buildCity } from '@/lib/internal/city'
import type { Hover, RawGraph } from '@/lib/internal/types'
import City from './City'
import { FOG, GROUND, MOON } from './palette'
import Tooltip from './Tooltip'

export default function CareNetwork({ raw }: { raw: RawGraph }) {
  const city = useMemo(() => buildCity(raw), [raw])
  const [hovered, setHover] = useState<Hover>(null)
  const hover = hovered && (city.clinicById[hovered.id] || city.docById[hovered.id]) ? hovered : null

  return (
    <div className="internal-root">
      <Canvas orthographic dpr={[1, 2]} camera={{ position: [60, 52, 60], zoom: 15, near: -300, far: 600 }}>
        <color attach="background" args={[GROUND]} />
        <fog attach="fog" args={[FOG, 120, 260]} />
        <ambientLight intensity={1.0} color="#5b7aa3" />
        <directionalLight position={[-30, 60, 25]} intensity={1.6} color={MOON} />
        <directionalLight position={[40, 18, -45]} intensity={0.7} color="#ff9a3c" />
        <City city={city} hover={hover} setHover={setHover} />
        <OrbitControls makeDefault enableDamping minZoom={7} maxZoom={50} maxPolarAngle={1.25} target={[0, 0, 0]} />
      </Canvas>
      <header className="hud">
        <h1>Care network</h1>
        <p className="tagline">Every clinic, doctor and price, on one map.</p>
        <p className="stats">
          {city.clinics.length} clinics &nbsp;·&nbsp; {city.doctors.length} doctors
        </p>
      </header>
      <p className="hint">Drag to rotate &nbsp;·&nbsp; scroll to zoom &nbsp;·&nbsp; hover for details</p>
      <Tooltip city={city} hover={hover} />
    </div>
  )
}
