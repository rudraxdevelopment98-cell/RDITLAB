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

export default function Hero() {
  return (
    <section id="home" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-amber-50 to-gray-100 pt-4 md:pt-8">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 pb-8 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative z-10 py-8 md:py-0">
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 md:px-4 py-2 text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-amber-700 mb-4 md:mb-6 shadow-sm">
              IT Solutions for Industry
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight text-gray-900">
              RD IT Lab UK
            </h1>
            <p className="text-base sm:text-lg md:text-lg lg:text-xl xl:text-2xl mb-6 md:mb-10 max-w-2xl text-gray-700 leading-relaxed">
              Expert IT services for commercial and industrial clients, delivering laptop repair, PC builds, networking, lab setup, audits, and ongoing software support.
            </p>
            <a href="/services" className="inline-flex items-center justify-center rounded-full bg-amber-600 px-6 md:px-12 py-3 md:py-4 text-base md:text-lg font-semibold text-white shadow-xl transition hover:bg-amber-700 active:scale-95">
              Explore Services
            </a>
          </div>
          <div className="hidden lg:block relative rounded-[1.5rem] md:rounded-[2rem] border border-amber-100 bg-white/90 shadow-[0_25px_80px_rgba(217,119,6,0.15)] p-3 md:p-4 backdrop-blur-sm">
            <div className="absolute inset-0 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-amber-100 to-white opacity-70" />
            <div className="relative h-[300px] sm:h-[400px] md:h-[450px] lg:h-[520px] overflow-hidden rounded-[1.35rem] md:rounded-[1.75rem]">
              <Canvas className="w-full h-full">
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
                <ambientLight intensity={0.8} />
                <pointLight position={[5, 5, 5]} intensity={1} />
                <pointLight position={[-5, -5, 5]} intensity={0.6} />
                <NetworkVisualization />
              </Canvas>
            </div>
            <div className="absolute left-3 md:left-6 bottom-3 md:bottom-6 rounded-2xl md:rounded-3xl border border-amber-100 bg-white/90 px-4 md:px-6 py-2 md:py-4 shadow-xl backdrop-blur-sm max-w-xs">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-700">Network building</p>
              <p className="mt-2 text-xs md:text-sm text-gray-700">Nodes connecting in a live system map to show secure infrastructure growth.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}