// src/components/Earth.jsx
import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

// Earth component
export default function Earth() {
    const earthRef = useRef(null);
    const texture = useLoader(THREE.TextureLoader, '/assets/3d/texture_earth.jpg');

    useFrame(({ clock }) => {
        if (earthRef.current) {
            earthRef.current.rotation.y = clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <mesh ref={earthRef}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
}
