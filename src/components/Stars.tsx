import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Componente para crear el grupo de estrellas
const Stars = () => {
    const ref = useRef<THREE.Points>();

    // Crear geometría de puntos y material
    useEffect(() => {
        const starsGeometry = new THREE.BufferGeometry();
        const starCount = 5000; // Número de estrellas
        const positions = new Float32Array(starCount * 3); // Posiciones x, y, z
        const sizes = new Float32Array(starCount); // Tamaños de las estrellas

        // Rellenar posiciones y tamaños de las estrellas
        for (let i = 0; i < starCount; i++) {
            // Generar coordenadas esféricas
            const radius = 1.2 + Math.random() * 0.5; // Radio aleatorio
            const phi = Math.acos(2 * Math.random() - 1); // Ángulo phi
            const theta = Math.random() * 2 * Math.PI; // Ángulo theta

            // Convertir de coordenadas esféricas a cartesianas
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            // Asignar posición
            positions.set([x, y, z], i * 3);
            sizes[i] = Math.random() * 0.005 + 0.002; // Tamaños aleatorios
        }

        starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        starsGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        if (ref.current) {
            ref.current.geometry = starsGeometry;
        }
    }, []);

    // Animar la rotación de las estrellas
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <points ref={ref}>
            <pointsMaterial
                size={0.002} // Tamaño base de las estrellas
                sizeAttenuation
                color="#ffffff" // Color blanco para las estrellas
                transparent
                depthWrite={false}
            />
        </points>
    );
};

// Lienzo principal para mostrar las estrellas
const StarsCanvas = () => {
    return (
        <div className="w-full h-auto absolute inset-0 z-[-1]">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Stars />
            </Canvas>
        </div>
    );
};

export default StarsCanvas;
