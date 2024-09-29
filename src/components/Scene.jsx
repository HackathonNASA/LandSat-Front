// src/components/Scene.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Earth from './Earth';
import { Preload } from "@react-three/drei"
import CanvasLoader from "./Loader";
import MovingStars from "../components/MovingStars.jsx";

export default function Scene() {
    return (
        <Canvas camera={{ position: [0, 0, 4] }} style={{ background: 'transparent' }}>
            <Suspense fallback={<CanvasLoader />}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <MovingStars />
                <Earth />
                <OrbitControls enableZoom={false} />
            </Suspense>
            <Preload all />
        </Canvas>
    );
}