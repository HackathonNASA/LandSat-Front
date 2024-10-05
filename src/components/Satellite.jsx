// Satellite.js
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

const Satellite = ({ distanceFromEarth, rotationSpeed }) => {
    const satelliteRef = useRef();

    useFrame(() => {
        if (satelliteRef.current) {
            // Rotar el satélite alrededor del eje Y (vertical)
            satelliteRef.current.rotation.y += rotationSpeed;
        }
    });

    return (
        <mesh ref={satelliteRef} position={[distanceFromEarth, 0, 0]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color="blue" />
        </mesh>
    );
};

export default Satellite;
