// src/components/Scene.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import EarthBackground from './EarthBackground.jsx';
import CanvasLoader from './Loader';
import MovingStars from './MovingStars.jsx';

export default function Scene() {
    return (
        <div className="h-full max-h-[calc(100vh-<altura-del-navbar>)] w-full">
            <Canvas camera={{ position: [0, 0, 4] }} style={{ background: 'transparent' }} className="h-full w-full">
                <Suspense fallback={<CanvasLoader />}>
                    {/* Aquí llamamos al componente de luces */}
                    <Lights />
                    <MovingStars />
                    <EarthBackground escala="2.5"/>
                    <OrbitControls enableZoom={false} />
                </Suspense>
                <Preload all />
            </Canvas>
        </div>
    );
}

// Coloca el componente Lights al final como habías mencionado
function Lights() {
    return (
        <>
            {/* Luz ambiental para dar iluminación general a la escena */}
            <ambientLight intensity={0.8} />

            {/* Luz puntual para iluminar desde un punto específico */}
            <pointLight position={[1, -10, -105]} intensity={1.2} />

            {/* Luz direccional para iluminar desde una dirección */}
            <directionalLight position={[0, 10, 0]} intensity={1.5} />
        </>
    );
}
