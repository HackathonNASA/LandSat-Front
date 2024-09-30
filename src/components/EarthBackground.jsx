import React, { useRef, useEffect } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function EarthBackground() {
    const earthRef = useRef(null);
    const texture = useLoader(THREE.TextureLoader, '/assets/3d/texture_earth.jpg');
    const scale = 1.5; // Set scale to 2 times bigger

    // Use the useFrame hook to rotate the Earth
    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.0015; // Adjust the speed of rotation here
            earthRef.current.rotation.x += 0.0015;
        }
    });

    return (
        <>
            <mesh
                ref={earthRef}
                scale={[scale, scale, scale]} // Scale the Earth
            >
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial map={texture} />
            </mesh>
        </>
    );
}
