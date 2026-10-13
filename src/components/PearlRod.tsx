import { useEffect, useRef, useState } from 'react'
import type { BufferGeometry, NormalBufferAttributes } from 'three'

export function PearlRod() {
  const host = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [spinning, setSpinning] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const spin = useRef(spinning)
  const refresh = useRef<() => void>(() => {})
  useEffect(() => { spin.current = spinning; refresh.current() }, [spinning])
  useEffect(() => {
    const stage = host.current!
    let cancelled = false, dispose = () => {}
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => setSpinning(!motion.matches)
    motion.addEventListener('change', onMotion)
    void Promise.all([import('three'), import('three/addons/environments/RoomEnvironment.js')]).then(([T, { RoomEnvironment }]) => {
      if (cancelled) return
      let renderer: InstanceType<typeof T.WebGLRenderer>
      try { renderer = new T.WebGLRenderer({ alpha: true, antialias: true }) } catch { return }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      renderer.toneMapping = T.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.35
      renderer.domElement.setAttribute('aria-hidden', 'true')
      stage.appendChild(renderer.domElement)
      dispose = () => { renderer.dispose(); renderer.domElement.remove() }
      const scene = new T.Scene(), camera = new T.PerspectiveCamera(33, 1, .1, 30)
      camera.position.set(0, .05, 8.4)
      const room = new RoomEnvironment(), pmrem = new T.PMREMGenerator(renderer)
      const environment = pmrem.fromScene(room, .04)
      scene.environment = environment.texture
      room.dispose(); pmrem.dispose()
      const pearl = new T.MeshPhysicalMaterial({ color: 0xfff5e4, metalness: .22, roughness: .16, clearcoat: 1, clearcoatRoughness: .06, iridescence: .48, iridescenceIOR: 1.3, iridescenceThicknessRange: [120, 360] })
      const silver = new T.MeshPhysicalMaterial({ color: 0xe8ded1, metalness: 1, roughness: .18 })
      const eye = new T.MeshPhysicalMaterial({ color: 0x4d1425, metalness: .5, roughness: .18 })
      const model = new T.Group(), jewel = new T.Group()
      model.rotation.z = -.18; model.rotation.y = -.35; model.add(jewel); scene.add(model)
      const add = (geometry: BufferGeometry<NormalBufferAttributes>, material = pearl, x = 0, y = 0, z = 0) => {
        const mesh = new T.Mesh(geometry, material)
        mesh.position.set(x, y, z); jewel.add(mesh); return mesh
      }
      add(new T.CylinderGeometry(.09, .065, 3.75, 48))
      add(new T.SphereGeometry(.23, 48, 32), pearl, 0, 2.05)
      add(new T.ConeGeometry(.065, .3, 8), silver, 0, -2.01).rotation.z = Math.PI
      for (const y of [1.83, 1.91, -1.85]) {
        add(new T.TorusGeometry(.095, .018, 10, 48), silver, 0, y).rotation.x = Math.PI / 2
      }
      for (let i = 0; i < 10; i++) {
        const angle = i / 10 * Math.PI * 2
        add(new T.OctahedronGeometry(.035), silver, Math.cos(angle) * .11, 1.87, Math.sin(angle) * .11)
      }
      const points = Array.from({ length: 180 }, (_, i) => {
        const t = i / 179, angle = t * Math.PI * 5.6 - .8
        return new T.Vector3(Math.cos(angle) * .28, -1.62 + t * 2.88, Math.sin(angle) * .28)
      })
      const curve = new T.CatmullRomCurve3(points), tube = new T.TubeGeometry(curve, 192, .085, 12, false)
      const positions = tube.attributes.position
      for (let ring = 0; ring <= 192; ring++) {
        const t = ring / 192, center = curve.getPointAt(t), taper = Math.min(1, .12 + t * 5)
        for (let side = 0; side <= 12; side++) {
          const i = ring * 13 + side
          const vertex = new T.Vector3().fromBufferAttribute(positions, i).sub(center).multiplyScalar(taper).add(center)
          positions.setXYZ(i, vertex.x, vertex.y, vertex.z)
        }
      }
      tube.computeVertexNormals(); add(tube)
      const headPoint = curve.getPointAt(1), direction = curve.getTangentAt(1)
      const head = new T.Group()
      head.position.copy(headPoint); head.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), direction)
      const face = new T.Mesh(new T.SphereGeometry(.12, 40, 28), pearl)
      face.scale.set(1.05, 1.75, .72); face.position.y = .1; head.add(face)
      for (const side of [-1, 1]) {
        const gem = new T.Mesh(new T.SphereGeometry(.018, 16, 12), eye)
        gem.position.set(side * .099, .19, .025); head.add(gem)
      }
      jewel.add(head)
      const key = new T.DirectionalLight(0xfff4dd, 3)
      key.position.set(-3, 4, 5); scene.add(key)
      const rim = new T.DirectionalLight(0xdbe6ff, 2)
      rim.position.set(3, -1, -3); scene.add(rim)
      let visible = true, frame = 0, previous = 0, pointer: number | null = null, lastX = 0
      const draw = () => { if (visible && !document.hidden) renderer.render(scene, camera) }
      const animate = (time: number) => {
        if (previous) model.rotation.y += Math.min((time - previous) / 1000, .05) * .22
        previous = time; draw(); frame = requestAnimationFrame(animate)
      }
      const sync = () => {
        cancelAnimationFrame(frame); previous = 0; draw()
        if (visible && !document.hidden && spin.current && pointer === null) frame = requestAnimationFrame(animate)
      }
      const resize = () => {
        const { width, height } = stage.getBoundingClientRect()
        if (!width || !height) return
        renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); draw()
      }
      const down = (event: PointerEvent) => {
        if (!event.isPrimary || event.button !== 0) return
        pointer = event.pointerId; lastX = event.clientX; setSpinning(false)
        try { stage.setPointerCapture(pointer) } catch { /* Capture is optional in older browsers. */ }
        sync()
      }
      const move = (event: PointerEvent) => {
        if (event.pointerId !== pointer) return
        model.rotation.y += (event.clientX - lastX) * .012; lastX = event.clientX; draw()
      }
      const up = (event: PointerEvent) => { if (event.pointerId === pointer) { pointer = null; sync() } }
      const keyboard = (event: KeyboardEvent) => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return
        event.preventDefault(); setSpinning(false); model.rotation.y += event.key === 'ArrowLeft' ? -.2 : .2; draw()
      }
      const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
      const sizing = new ResizeObserver(resize)
      intersection.observe(stage); sizing.observe(stage)
      stage.addEventListener('pointerdown', down); stage.addEventListener('pointermove', move)
      stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up); stage.addEventListener('lostpointercapture', up)
      stage.addEventListener('keydown', keyboard); document.addEventListener('visibilitychange', sync)
      refresh.current = sync; resize(); sync(); setReady(true)
      dispose = () => {
        cancelAnimationFrame(frame); intersection.disconnect(); sizing.disconnect(); refresh.current = () => {}
        stage.removeEventListener('pointerdown', down); stage.removeEventListener('pointermove', move)
        stage.removeEventListener('pointerup', up); stage.removeEventListener('pointercancel', up); stage.removeEventListener('lostpointercapture', up)
        stage.removeEventListener('keydown', keyboard); document.removeEventListener('visibilitychange', sync)
        scene.traverse(object => { if (object instanceof T.Mesh) object.geometry.dispose() })
        pearl.dispose(); silver.dispose(); eye.dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove()
      }
    }).catch(() => { dispose(); if (!cancelled) setReady(false) })
    return () => { cancelled = true; motion.removeEventListener('change', onMotion); dispose() }
  }, [])
  return <figure className={`pearl-rod${ready ? ' is-ready' : ''}`}>
    <div ref={host} className="rod-stage" tabIndex={ready ? 0 : -1} role="img" aria-label="Pearl Rod of Asclepius sculpture. Drag or use left and right arrow keys to rotate." style={{ touchAction: 'pan-y' }}>
      <img className="rod-fallback" src="/images/pearl-rod.webp" alt="A luminous pearl staff with one serpent, crafted like fine jewelry." />
    </div>
    <button className="rod-control" type="button" disabled={!ready} aria-pressed={ready && spinning} onClick={() => setSpinning(value => !value)}>{ready && spinning ? 'Pause rotation' : 'Rotate sculpture'}</button>
  </figure>
}
