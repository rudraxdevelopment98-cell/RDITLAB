'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import * as THREE from 'three'

function NetworkVisualization() {
  const nodes = [
    { pos: [1.8, 0.8, 0], id: 0 },
    { pos: [2.8, 0.2, 0], id: 1 },
    { pos: [2.2, -0.8, 0], id: 2 },
    { pos: [3.6, 0.6, 0], id: 3 },
    { pos: [4.2, -0.4, 0], id: 4 },
    { pos: [4.8, 0.4, 0], id: 5 }
  ]

  const connections = [
    [0, 1], [1, 2], [0, 2], [1, 3], [3, 4], [4, 5], [2, 4]
  ]

  return (
    <group>
      {nodes.map((node, index) => (
        <Float key={index} speed={1 + index * 0.15} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={node.pos as [number, number, number]}>
            <sphereGeometry args={[0.12, 18, 18]} />
            <meshStandardMaterial color="#a78bfa" emissive="#8b5cf6" emissiveIntensity={0.6} />
          </mesh>
        </Float>
      ))}
      {connections.map((conn, index) => {
        const start = nodes[conn[0]].pos as [number, number, number]
        const end = nodes[conn[1]].pos as [number, number, number]
        const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
        const geometry = new THREE.BufferGeometry().setFromPoints(points)

        return (
          <line key={index}>
            <primitive attach="geometry" object={geometry} />
            <lineBasicMaterial attach="material" color="#7c3aed" linewidth={2} />
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
    <section id="home" className="relative overflow-hidden bg-ink-950 text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid-dark [background-size:44px_44px]" />
      <div className="pointer-events-none absolute -left-32 -top-24 h-96 w-96 rounded-full bg-violet-600/30 blur-[120px] animate-blob" />
      <div className="pointer-events-none absolute right-0 top-32 h-[26rem] w-[26rem] rounded-full bg-indigo-500/25 blur-[120px] animate-blob [animation-delay:5s]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />

      <div className="container relative z-10 mx-auto max-w-7xl pb-16 pt-10 md:pb-24 md:pt-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-violet-200 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
              </span>
              IT &amp; Software Solutions
            </p>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.03] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Build, fix &amp; ship <br className="hidden sm:block" />
              <span className="text-gradient-brand">without the hassle.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg lg:text-xl">
              From laptop &amp; PC repair and networking to custom websites and software — RD IT Lab UK
              delivers secure, reliable technology for businesses across the UK.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/web-development"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-brand transition hover:shadow-brand-lg active:scale-95"
              >
                See our work &amp; plans
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 active:scale-95"
              >
                Get a quote
              </a>
            </div>

            {/* Trust stats */}
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-2xl font-bold text-white sm:text-3xl">{stat.value}</dt>
                  <dd className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 3D card */}
          <div className="relative hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-glow backdrop-blur-sm md:p-4 lg:block">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-violet-500/20 to-transparent" />
            <div className="relative h-[450px] overflow-hidden rounded-[1.75rem] lg:h-[520px]">
              <Canvas className="h-full w-full">
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
                <ambientLight intensity={0.7} />
                <pointLight position={[5, 5, 5]} intensity={1.1} color="#c4b5fd" />
                <pointLight position={[-5, -5, 5]} intensity={0.7} color="#818cf8" />
                <NetworkVisualization />
              </Canvas>
            </div>
            <div className="absolute bottom-6 left-6 max-w-xs rounded-3xl border border-white/10 glass-dark px-6 py-4 shadow-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-violet-300">Secure by design</p>
              <p className="mt-2 text-sm text-slate-300">
                Live infrastructure map — nodes connecting to show secure, scalable systems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
