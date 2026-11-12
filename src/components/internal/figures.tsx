import { Edges } from '@react-three/drei'

import { CHAMPAGNE, CREAM, DIM_EDGE, GOLD } from './palette'
import { Block, Windows } from './primitives'

export function FillerBlock({ h, w }: { h: number; w: number }) {
  const rows = Math.max(1, Math.round(h / 1.1))
  return (
    <>
      <Block position={[0, h / 2, 0]} size={[w, h, w]} color="#0f1823" edge={DIM_EDGE} />
      <Windows position={[0, h / 2, 0]} size={[w, h, w]} rows={rows} glass="#9a7434" edge={DIM_EDGE} />
    </>
  )
}

export function Tree() {
  return (
    <>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.6, 6]} />
        <meshStandardMaterial color="#0f1823" />
        <Edges color={DIM_EDGE} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <coneGeometry args={[0.55, 1.4, 8]} />
        <meshStandardMaterial color="#142433" roughness={0.95} />
        <Edges color={DIM_EDGE} threshold={20} />
      </mesh>
    </>
  )
}

export function DoctorFigure({ hot }: { hot?: boolean }) {
  const edge = hot ? GOLD : '#04070c'
  return (
    <group scale={1.35}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.6, 10]} />
        <meshStandardMaterial color="#0f1823" />
      </mesh>
      <mesh position={[0, 0.88, 0]}>
        <capsuleGeometry args={[0.2, 0.42, 4, 12]} />
        <meshStandardMaterial color={CREAM} roughness={0.85} emissive={CREAM} emissiveIntensity={hot ? 0.35 : 0.12} />
        <Edges color={edge} threshold={30} />
      </mesh>
      <mesh position={[0, 1.42, 0]}>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshStandardMaterial color="#cfe0ee" roughness={0.85} emissive="#cfe0ee" emissiveIntensity={0.12} />
        <Edges color={edge} threshold={30} />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation-x={-Math.PI / 2} scale={hot ? 1.35 : 1}>
        <ringGeometry args={[0.34, 0.44, 28]} />
        <meshBasicMaterial color={hot ? CHAMPAGNE : GOLD} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 1.9, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
