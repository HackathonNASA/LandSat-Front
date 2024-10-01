// src/components/Scene.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import EarthBackground from './EarthBackground.jsx';
import { Preload } from "@react-three/drei";
import CanvasLoader from "./Loader";
import MovingStars from "../components/MovingStars.jsx";

export default function Scene() {
    return (
        <div className="h-full max-h-[calc(100vh-<altura-del-navbar>)] w-full">
            <Canvas camera={{ position: [0, 0, 4] }} style={{ background: 'transparent' }} className="h-full w-full">
                <Suspense fallback={<CanvasLoader />}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <MovingStars />
                    <EarthBackground />
                    <OrbitControls enableZoom={false} />
                </Suspense>
                <Preload all />
            </Canvas>
        </div>
    );
}

