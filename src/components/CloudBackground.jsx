import React, { useRef, useEffect } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CloudBackground() {
    const cloudRef = useRef(null);
    const mapCloud = useLoader(THREE.TextureLoader, '/assets/textures/earthCloud.png')
    const scale = 1.7; //Set size of Earth

    // Use the useFrame hook to rotate the Earth
    useFrame(() => {
        if (cloudRef.current) {
            cloudRef.current.rotation.y += 0.003;
            cloudRef.current.rotation.y += 0.0001;
        }
    });

    return (
        <>
            <mesh
                ref={cloudRef}
                scale={[scale, scale, scale]} // Scale the Earth
                position={[0, -0.3, 0]} // Move the Earth (centered now due to NavBar)
            >
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshPhongMaterial 
                    map={mapCloud} 
                    transparent={true}
                    opacity={0.8}
                />
            </mesh>
        </>
    );
}