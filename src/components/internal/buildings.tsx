import { Edges } from '@react-three/drei'

import { CHAMPAGNE, GOLD, WALL } from './palette'
import { Block, Tower, Windows } from './primitives'

type HotProps = { hot?: boolean }

export function Hospital({ hot }: HotProps) {
  return (
    <>
      <Tower position={[0.4, 2.1, -0.3]} size={[3.2, 4.2, 2.6]} rows={5} hot={hot} />
      <Tower position={[-1.9, 1.15, 0.9]} size={[2, 2.3, 2]} rows={3} hot={hot} />
      <Block position={[0.4, 4.3, -0.3]} size={[1.1, 0.12, 0.34]} color="#f6eee4" emissive="#f6eee4" noEdge />
      <Block position={[0.4, 4.3, -0.3]} size={[0.34, 0.12, 1.1]} color="#f6eee4" emissive="#f6eee4" noEdge />
    </>
  )
}

export function Clinic({ hot }: HotProps) {
  return (
    <>
      <Tower position={[0, 1.3, 0]} size={[3.8, 2.6, 3]} rows={2} hot={hot} />
      <Block position={[0, 2.7, 0]} size={[4.1, 0.2, 3.3]} hot={hot} />
      <Block position={[1.4, 0.9, 1.9]} size={[1.6, 0.14, 1.2]} hot={hot} />
      <Block position={[2.05, 0.45, 2.35]} size={[0.14, 0.9, 0.14]} hot={hot} />
    </>
  )
}

function Drum({ y, args, hot }: { y: number; args: [number, number, number, number]; hot?: boolean }) {
  return (
    <mesh position={[0, y, 0]}>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={WALL} roughness={0.85} />
      <Edges color={hot ? CHAMPAGNE : GOLD} threshold={20} />
    </mesh>
  )
}

export function Imaging({ hot }: HotProps) {
  return (
    <>
      <Drum y={1.6} args={[1.9, 1.9, 3.2, 28]} hot={hot} />
      <Drum y={3.3} args={[1.2, 1.5, 0.3, 28]} hot={hot} />
      <Block position={[0, 0.7, 2.1]} size={[2.4, 1.4, 1.2]} hot={hot} />
      <Windows position={[0, 0.7, 2.1]} size={[2.4, 1.4, 1.2]} rows={1} hot={hot} />
    </>
  )
}

export function Surgery({ hot }: HotProps) {
  return (
    <>
      <Tower position={[-0.8, 1.5, -0.4]} size={[2.4, 3, 3.4]} rows={3} hot={hot} />
      <Tower position={[1.2, 0.9, 0.9]} size={[2.8, 1.8, 1.6]} rows={2} hot={hot} />
      <Block position={[1.2, 1.9, 0.9]} size={[3, 0.14, 1.8]} hot={hot} />
    </>
  )
}

export function Specialty({ hot }: HotProps) {
  return (
    <>
      <Tower position={[0, 0.9, 0]} size={[3.6, 1.8, 3.2]} rows={2} hot={hot} />
      <Tower position={[0, 2.5, 0]} size={[2.6, 1.6, 2.3]} rows={2} hot={hot} />
      <Tower position={[0, 3.9, 0]} size={[1.6, 1.2, 1.4]} rows={1} hot={hot} />
      <Block position={[0, 4.6, 0]} size={[0.12, 0.8, 0.12]} hot={hot} />
    </>
  )
}

const BY_KIND: Record<string, (props: HotProps) => React.JSX.Element> = {
  hospital: Hospital,
  clinic: Clinic,
  imaging_center: Imaging,
  surgery_center: Surgery,
  specialty_clinic: Specialty,
}

export function ClinicBuilding({ kind, hot }: { kind: string | null } & HotProps) {
  const Comp = (kind && BY_KIND[kind]) || Clinic
  return <Comp hot={hot} />
}
