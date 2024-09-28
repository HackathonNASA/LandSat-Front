// src/components/Scene.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import MovingStars from './MovingStars';
import Earth from './Earth';
import { Preload } from "@react-three/drei"
import CanvasLoader from "./Loader";
// Scene component that includes the stars and Earth
export default function Scene() {
    return (
        <Canvas camera={{ position: [0, 0, 4] }}>
            <Suspense fallback={<CanvasLoader />}>
                {/* Ambient light for the scene */}
                <ambientLight intensity={0.5} />
                {/* Point light to illuminate objects */}
                <pointLight position={[10, 10, 10]} />
                {/* Add MovingStars to the scene */}
                <MovingStars />
                {/* Add Earth to the scene */}
                <Earth />
                {/* OrbitControls to interact with the scene */}
                <OrbitControls enableZoom={false} />
            </Suspense>
            <Preload all />
        </Canvas>
    );
}
