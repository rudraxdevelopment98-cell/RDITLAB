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
            <meshStandardMaterial color="#d4af37" emissive="#fcd34d" emissiveIntensity={0.4} />
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
            <lineBasicMaterial attach="material" color="#f59e0b" linewidth={2} />
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
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-white via-amber-50 to-gray-100 pt-6 md:pt-12"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 bg-grid-faint [background-size:40px_40px] opacity-60" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl animate-blob [animation-delay:4s]" />

      <div className="container relative z-10 mx-auto max-w-7xl pb-14 md:pb-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="py-8 md:py-12 animate-fade-in-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-600" />
              </span>
              IT Solutions for Industry
            </p>

            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl xl:text-7xl">
              Reliable IT, <br className="hidden sm:block" />
              <span className="text-gradient-brand">built to last.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg lg:text-xl">
              Expert IT services for commercial and industrial clients — laptop &amp; PC repair,
              custom builds, networking, lab setup, audits, and ongoing software support across the UK.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 px-8 py-4 text-base font-semibold text-white shadow-brand transition hover:bg-amber-700 hover:shadow-brand-lg active:scale-95"
              >
                Explore Services
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200 bg-white px-8 py-4 text-base font-semibold text-amber-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 active:scale-95"
              >
                Get a quote
              </a>
            </div>

            {/* Trust stats */}
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">{stat.value}</dt>
                  <dd className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 3D card */}
          <div className="relative hidden rounded-[2rem] border border-amber-100 bg-white/90 p-3 shadow-brand-lg backdrop-blur-sm md:p-4 lg:block">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-amber-100 to-white opacity-70" />
            <div className="relative h-[450px] overflow-hidden rounded-[1.75rem] lg:h-[520px]">
              <Canvas className="h-full w-full">
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
                <ambientLight intensity={0.8} />
                <pointLight position={[5, 5, 5]} intensity={1} />
                <pointLight position={[-5, -5, 5]} intensity={0.6} />
                <NetworkVisualization />
              </Canvas>
            </div>
            <div className="absolute bottom-6 left-6 max-w-xs rounded-3xl border border-amber-100 glass px-6 py-4 shadow-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-700">Network building</p>
              <p className="mt-2 text-sm text-gray-700">
                Nodes connecting in a live system map to show secure infrastructure growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
