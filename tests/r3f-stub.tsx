import type { ReactNode } from 'react'

const Nothing = () => null

export const Edges = Nothing
export const Line = Nothing
export const OrbitControls = Nothing
export const Canvas = Nothing
export const Html = ({ children }: { children?: ReactNode }) => <>{children}</>
export const Text = ({ children }: { children?: ReactNode }) => <>{children}</>
export const Billboard = ({ children }: { children?: ReactNode }) => <>{children}</>
