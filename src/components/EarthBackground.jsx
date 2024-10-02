import React, { useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function EarthBackground({ escala }) {
    const earthRef = useRef(null);
    const cloudRef = useRef();
    
    // Cargamos las texturas
    const [earthMap, earthBumpMap, cloudMap] = useLoader(THREE.TextureLoader, [
        '/assets/textures/earthmap1k.jpg',   // Mapa de color de la Tierra
        '/assets/textures/earthbump.jpg',    // Mapa de relieve (bump map)
        '/assets/textures/earthCloud.png'    // Nubes de la Tierra
    ]);

    const scale = escala; // Tamaño de la Tierra

    // Animación de rotación para la Tierra y las nubes
    useFrame(() => {
        earthRef.current.rotation.y += 0.0031;
        cloudRef.current.rotation.y += 0.002;
    });

    return (
        <>
            {/* Malla de la Tierra */}
            <mesh ref={earthRef} scale={[scale, scale, scale]} position={[0, -0.3, 0]}>
                <sphereGeometry args={[0.6, 64, 64]} /> {/* Aumentamos la geometría para más detalle */}
                
                <meshStandardMaterial 
                    map={earthMap}              // Textura base
                    bumpMap={earthBumpMap}       // Mapa de relieve
                    bumpScale={0.1}             // Ajustamos el relieve a un valor más sutil
                    roughness={0.8}             // Ajustamos rugosidad para que no brille tanto
                    metalness={0.1}             // Ligero toque metálico para mejorar reflejos
                />
            </mesh>

            {/* Malla de las nubes */}
            <mesh ref={cloudRef} scale={[scale, scale, scale]} position={[0, -0.3, 0]}>
                <sphereGeometry args={[0.63, 64, 64]} />
                <meshPhongMaterial 
                    map={cloudMap} 
                    transparent={true}
                    opacity={0.4}  
                    depthWrite={false}  
                />
            </mesh>
        </>
    );
}
