'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import * as THREE from 'three'

function NetworkVisualization() {
  const nodes = [
    { pos: [1.8, 0.8, 0] }, { pos: [2.8, 0.2, 0] }, { pos: [2.2, -0.8, 0] },
    { pos: [3.6, 0.6, 0] }, { pos: [4.2, -0.4, 0] }, { pos: [4.8, 0.4, 0] },
  ]
  const connections = [[0, 1], [1, 2], [0, 2], [1, 3], [3, 4], [4, 5], [2, 4]]

  return (
    <group>
      {nodes.map((node, index) => (
        <Float key={index} speed={1 + index * 0.15} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={node.pos as [number, number, number]}>
            <sphereGeometry args={[0.12, 18, 18]} />
            <meshStandardMaterial color="#a78bfa" emissive="#22d3ee" emissiveIntensity={0.5} />
          </mesh>
        </Float>
      ))}
      {connections.map((conn, index) => {
        const start = nodes[conn[0]].pos as [number, number, number]
        const end = nodes[conn[1]].pos as [number, number, number]
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...start),
          new THREE.Vector3(...end),
        ])
        return (
          <line key={index}>
            <primitive attach="geometry" object={geometry} />
            <lineBasicMaterial attach="material" color="#8b5cf6" linewidth={2} />
          </line>
        )
      })}
    </group>
  )
}

const stats = [
  { value: '4.5+', label: 'Years experience' },
  { value: '1–4', label: 'Day turnaround' },
  { value: '24/7', label: 'Emergency support' },
  { value: '1yr', label: 'Warranty up to' },
]

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      {/* Aurora + grid backdrop */}
      <div className="absolute inset-0 -z-10 bg-grid-light dark:bg-grid-dark [background-size:44px_44px]" />
      <div className="aurora left-[-10%] top-[-8%] h-[28rem] w-[28rem] animate-aurora" style={{ background: 'var(--aurora-1)' }} />
      <div className="aurora right-[-8%] top-[10%] h-[26rem] w-[26rem] animate-aurora [animation-delay:6s]" style={{ background: 'var(--aurora-2)' }} />
      <div className="aurora bottom-[-12%] left-[30%] h-[24rem] w-[24rem] animate-aurora [animation-delay:3s]" style={{ background: 'var(--aurora-3)' }} />

      <div className="container relative z-10 mx-auto max-w-7xl pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in-up">
            <p className="glass glass-edge inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              IT &amp; Software Solutions
            </p>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.03] tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl xl:text-7xl">
              Build, fix &amp; ship <br className="hidden sm:block" />
              <span className="text-gradient-brand">without the hassle.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg lg:text-xl">
              From laptop &amp; PC repair and networking to custom websites and software — RD IT Lab UK
              delivers secure, reliable technology for businesses across the UK.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/web-development"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-brand transition hover:shadow-glow active:scale-95"
              >
                See our work &amp; plans
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/contact"
                className="glass glass-edge inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-[var(--text)] transition hover:scale-[1.02] active:scale-95"
              >
                Get a quote
              </a>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="glass glass-edge rounded-2xl px-4 py-3">
                  <dt className="font-display text-2xl font-bold text-[var(--text)]">{stat.value}</dt>
                  <dd className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 3D glass panel */}
          <div className="glass glass-edge relative hidden rounded-[2rem] p-3 shadow-glow md:p-4 lg:block">
            <div className="relative h-[450px] overflow-hidden rounded-[1.6rem] lg:h-[520px]">
              <Canvas className="h-full w-full">
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
                <ambientLight intensity={0.8} />
                <pointLight position={[5, 5, 5]} intensity={1.1} color="#c4b5fd" />
                <pointLight position={[-5, -5, 5]} intensity={0.7} color="#22d3ee" />
                <NetworkVisualization />
              </Canvas>
            </div>
            <div className="glass glass-edge absolute bottom-6 left-6 max-w-xs rounded-2xl px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gradient-brand">Secure by design</p>
              <p className="mt-2 text-sm text-muted">Live infrastructure map — nodes connecting to show secure, scalable systems.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
