/*
"use client"

import { useRef } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { Stars, OrbitControls } from "@react-three/drei"
import * as THREE from "three"

function Earth() {
  const earthRef = useRef < THREE.Mesh > (null)
  const texture = useLoader(THREE.TextureLoader, "/assets/3d/texture_earth.jpg")

  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.1
    }
  })

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

function MovingStars() {
  const starsRef = useRef < THREE.Points > (null)

  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.05
      starsRef.current.rotation.x = clock.getElapsedTime() * 0.025
    }
  })

  return (
    <Stars
      ref={starsRef}
      radius={100}
      depth={50}
      count={5000}
      factor={4}
      saturation={0}
      fade
      speed={1}
    />
  )
}

export default function LandsatTracker() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <MovingStars />
        <Earth />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}
*/
