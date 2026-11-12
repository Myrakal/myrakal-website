import { Edges } from '@react-three/drei'

import type { Vec3 } from '@/lib/internal/types'

import { CHAMPAGNE, GLASS, GOLD, WALL } from './palette'

type BlockProps = {
  position?: Vec3
  size?: Vec3
  color?: string
  edge?: string
  hot?: boolean
  noEdge?: boolean
  emissive?: string
}

export function Block({ position = [0, 0, 0], size = [1, 1, 1], color = WALL, edge = GOLD, hot, noEdge, emissive }: BlockProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.85} emissive={emissive ?? '#000000'} emissiveIntensity={emissive ? 0.45 : 0} />
      {!noEdge && <Edges color={hot ? CHAMPAGNE : edge} />}
    </mesh>
  )
}

type WindowsProps = { position: Vec3; size: Vec3; rows: number; hot?: boolean; glass?: string; edge?: string }

export function Windows({ position, size: [w, h, d], rows, hot, glass = GLASS, edge = GOLD }: WindowsProps) {
  const rh = h / rows
  return Array.from({ length: rows }, (_, i) => {
    const y = position[1] - h / 2 + (i + 0.5) * rh
    const shared = { color: glass, emissive: glass, edge, hot }
    return [
      <Block key={`z${i}`} {...shared} position={[position[0], y, position[2] + d / 2 + 0.02]} size={[w * 0.82, rh * 0.5, 0.04]} />,
      <Block key={`x${i}`} {...shared} position={[position[0] + w / 2 + 0.02, y, position[2]]} size={[0.04, rh * 0.5, d * 0.82]} />,
    ]
  }).flat()
}

type TowerProps = { position: Vec3; size: Vec3; rows: number; hot?: boolean }

export function Tower({ position, size, rows, hot }: TowerProps) {
  return (
    <>
      <Block position={position} size={size} hot={hot} />
      <Windows position={position} size={size} rows={rows} hot={hot} />
    </>
  )
}
