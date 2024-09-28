// src/components/MovingStars.jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// MovingStars component
export default function MovingStars() {
    const starsRef = useRef(null);

    useFrame(({ clock }) => {
        if (starsRef.current) {
            // Adding slight rotations for dynamic effect
            starsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
            starsRef.current.rotation.x = clock.getElapsedTime() * 0.025;
        }
    });

    return (
        <Stars
            ref={starsRef}         // Reference to rotate the stars
            radius={100}           // Radius of the stars sphere
            depth={50}             // Depth of the stars' spread
            count={5000}           // Number of stars to display
            factor={4}             // Size factor for star clusters
            saturation={0}         // No color saturation, white stars
            fade                   // Enables fading of stars as they go further
            speed={1}              // Speed of the star's rotation or motion
        />
    );
}
