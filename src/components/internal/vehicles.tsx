import { memo, type ReactNode } from 'react'

import { streetLayout } from '@/lib/internal/street'
import type { City, Vec3 } from '@/lib/internal/types'
import { Block } from './primitives'

const HEAD = '#ffe7b0'
const TAIL = '#ff3b30'
const LAMP = '#ffd28a'

function Lit({ position, size, color }: { position: Vec3; size: Vec3; color: string }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.2} />
    </mesh>
  )
}

export function Car({ color }: { color: string }) {
  return (
    <group>
      <Block noEdge position={[0, 0.3, 0]} size={[1.9, 0.45, 0.95]} color={color} />
      <Block noEdge position={[-0.1, 0.7, 0]} size={[1, 0.4, 0.8]} color="#0b0d12" />
      {[-0.3, 0.3].map((z) => (
        <group key={z}>
          <Lit position={[0.96, 0.32, z]} size={[0.06, 0.12, 0.2]} color={HEAD} />
          <Lit position={[-0.96, 0.32, z]} size={[0.06, 0.1, 0.2]} color={TAIL} />
        </group>
      ))}
    </group>
  )
}

export function Van({ color, children }: { color: string; children?: ReactNode }) {
  return (
    <group>
      <Block noEdge position={[-0.2, 0.7, 0]} size={[2.4, 0.95, 1.1]} color={color} />
      <Block noEdge position={[1.2, 0.55, 0]} size={[0.8, 0.65, 1.05]} color={color} />
      <Block noEdge position={[1.45, 0.75, 0]} size={[0.3, 0.3, 0.95]} color="#0b0d12" />
      {[-0.35, 0.35].map((z) => (
        <group key={z}>
          <Lit position={[1.62, 0.4, z]} size={[0.06, 0.12, 0.2]} color={HEAD} />
          <Lit position={[-1.42, 0.4, z]} size={[0.06, 0.1, 0.2]} color={TAIL} />
        </group>
      ))}
      {children}
    </group>
  )
}

export function Ambulance() {
  return (
    <Van color="#e8eaee">
      <Block noEdge position={[-0.2, 0.8, 0]} size={[2.42, 0.16, 1.12]} color="#c4161c" />
      <Lit position={[0.3, 1.25, 0.3]} size={[0.3, 0.12, 0.3]} color="#ff2d2d" />
      <Lit position={[0.3, 1.25, -0.3]} size={[0.3, 0.12, 0.3]} color="#2d6bff" />
    </Van>
  )
}

export function Streetlamp() {
  return (
    <group>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 3.2, 8]} />
        <meshStandardMaterial color="#15171c" />
      </mesh>
      <Lit position={[0, 3.25, 0]} size={[0.5, 0.14, 0.3]} color={LAMP} />
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, 0]}>
        <circleGeometry args={[2.2, 24]} />
        <meshBasicMaterial color={LAMP} transparent opacity={0.16} depthWrite={false} />
      </mesh>
    </group>
  )
}

export function StreetScene({ city }: { city: City }) {
  const { vehicles, ambulances, lamps } = streetLayout(city)
  return (
    <>
      {vehicles.map((v, i) => (
        <group key={`v${i}`} position={[v.pos[0], 0, v.pos[1]]} rotation={[0, v.rot, 0]}>
          {v.van ? <Van color={v.color} /> : <Car color={v.color} />}
        </group>
      ))}
      {ambulances.map((a, i) => (
        <group key={`a${i}`} position={[a.pos[0], 0, a.pos[1]]} rotation={[0, a.rot, 0]}>
          <Ambulance />
        </group>
      ))}
      {lamps.map((l, i) => (
        <group key={`l${i}`} position={[l[0], 0, l[1]]}>
          <Streetlamp />
        </group>
      ))}
    </>
  )
}

export const Street = memo(StreetScene)
