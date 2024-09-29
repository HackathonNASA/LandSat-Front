import { useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function Earth() {
    const earthRef = useRef(null);
    const texture = useLoader(THREE.TextureLoader, '/assets/3d/texture_earth.jpg');
    const [scale, setScale] = useState(1); // Estado para controlar el tamaño de la Tierra
    const [pins, setPins] = useState([]); // Estado para guardar los pines
    const [isZoomed, setIsZoomed] = useState(false); // Estado para verificar si la Tierra está grande

    // Rotación continua de la Tierra
    useFrame(({ clock }) => {
        if (earthRef.current) {
            earthRef.current.rotation.y = clock.getElapsedTime() * 0.1;
        }
    });

    // Función para manejar el clic en la Tierra
    const handleEarthClick = (event) => {
        if (!isZoomed) {
            // Aumenta el tamaño de la Tierra al hacer clic
            setScale(1.2); // Cambia el tamaño
            setIsZoomed(true); // Marca que la Tierra está en tamaño grande
        } else {
            // Cambia el tamaño y resetea el estado de zoom
            setScale(1);
            setIsZoomed(false);
        }

        // Solo coloca un pin si la Tierra está en tamaño grande
        if (isZoomed) {
            // Calcula el punto de clic en la superficie de la esfera
            const point = new THREE.Vector3();
            point.copy(event.point).normalize(); // Normaliza el punto de clic

            // Convierte el punto a coordenadas esféricas (lat, lng)
            const phi = Math.acos(point.y); // Latitud
            const theta = Math.atan2(point.z, point.x); // Longitud

            const lat = 90 - (phi * 180) / Math.PI;
            const lng = (theta * 180) / Math.PI;

            // Guarda las coordenadas del pin, alejándolas si está en zoom
            const pinDistance = isZoomed ? 1.05 : 1.5; // Factor de distancia del pin
            setPins((prevPins) => [
                ...prevPins,
                { lat, lng, position: point.clone().multiplyScalar(pinDistance) }
            ]);
        }
    };

    return (
        <>
            <mesh ref={earthRef} onClick={handleEarthClick} scale={[scale, scale, scale]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial map={texture} />
            </mesh>

            {/* Renderiza los pines */}
            {pins.map((pin, index) => (
                <mesh key={index} position={pin.position}>
                    <sphereGeometry args={[0.02, 16, 16]} /> {/* Pin pequeño */}
                    <meshBasicMaterial color="red" />
                </mesh>
            ))}
        </>
    );
}
