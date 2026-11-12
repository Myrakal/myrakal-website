import { memo } from 'react'
import { Html, Line } from '@react-three/drei'

import { relatedTo } from '@/lib/internal/city'
import type { City as CityModel, Clinic, Doctor, Hover, Vec2, Vec3 } from '@/lib/internal/types'
import { ClinicBuilding } from './buildings'
import { DoctorFigure, FillerBlock, Tree } from './figures'
import { CHAMPAGNE, GOLD } from './palette'
import { Street } from './vehicles'

type SetHover = (hover: Hover) => void

const circle = (r: number, n = 64): Vec3[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return [Math.cos(a) * r, 0.04, Math.sin(a) * r]
  })

const PLATFORM = circle(5.3)

function Ground({ extent }: { extent: Vec2 }) {
  const [w, d] = extent
  const size = Math.max(w, d) + 40
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0]} renderOrder={-1}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#120709" transparent opacity={0.6} depthWrite={false} />
      </mesh>
      <gridHelper args={[size, Math.round(size / 3), '#4a1a22', '#2e1015']} position={[0, 0, 0]} />
    </>
  )
}

function hoverHandlers(type: 'clinic' | 'doctor', id: string, setHover: SetHover) {
  return {
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      setHover({ type, id })
    },
    onPointerOut: () => setHover(null),
  }
}

function ClinicPad({ clinic, hot, dim, setHover }: { clinic: Clinic; hot: boolean; dim: boolean; setHover: SetHover }) {
  return (
    <group position={[clinic.pos[0], 0, clinic.pos[1]]} {...hoverHandlers('clinic', clinic.id, setHover)}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <circleGeometry args={[5.3, 48]} />
        <meshStandardMaterial color={hot ? '#5a1624' : '#2e0810'} />
      </mesh>
      <Line points={PLATFORM} color={hot ? CHAMPAGNE : GOLD} lineWidth={1.4} />
      <ClinicBuilding kind={clinic.kind} hot={hot} />
      <Html position={[0, 5.4, 0]} center zIndexRange={[5, 0]} style={{ opacity: dim ? 0.35 : 1 }}>
        <div className="label">{clinic.name}</div>
      </Html>
    </group>
  )
}

function DoctorPin({ doctor, hot, setHover }: { doctor: Doctor; hot: boolean; setHover: SetHover }) {
  return (
    <group position={[doctor.pos[0], 0, doctor.pos[1]]} {...hoverHandlers('doctor', doctor.id, setHover)}>
      <DoctorFigure hot={hot} />
    </group>
  )
}

const MemoClinic = memo(ClinicPad)
const MemoDoctor = memo(DoctorPin)

export default function City({ city, hover, setHover }: { city: CityModel; hover: Hover; setHover: SetHover }) {
  const rel = relatedTo(city, hover)
  return (
    <>
      <Ground extent={city.extent} />
      <Street city={city} />
      {city.filler.map((f, i) => (
        <group key={i} position={[f.pos[0], 0, f.pos[1]]}>
          {f.kind === 'tree' ? <Tree /> : <FillerBlock h={f.h} w={f.w} />}
        </group>
      ))}
      {city.clinics.map((c) => (
        <MemoClinic key={c.id} clinic={c} hot={rel.clinics.has(c.id)} dim={rel.active && !rel.clinics.has(c.id)} setHover={setHover} />
      ))}
      {city.doctors.map((d) => (
        <MemoDoctor key={d.id} doctor={d} hot={rel.doctors.has(d.id)} setHover={setHover} />
      ))}
      {city.links.map((l) => {
        const on = !!hover && rel.doctors.has(l.doctorId) && l.clinicIds.some((id) => rel.clinics.has(id))
        return <Line key={l.id} points={l.points} color={on ? CHAMPAGNE : GOLD} lineWidth={on ? 3 : 1.4} transparent opacity={rel.active && !on ? 0.2 : 0.9} />
      })}
    </>
  )
}
