import React, { useRef, useState, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export default function Earth() {
    const earthRef = useRef(null);
    const texture = useLoader(THREE.TextureLoader, '/assets/3d/texture_earth.jpg');
    const [scale, setScale] = useState(1.5);
    const [pins, setPins] = useState([]);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isDragging, setIsDragging] = useState(false); // Detectar arrastre

    // Estado para input de coordenadas
    const [inputLat, setInputLat] = useState('');
    const [inputLng, setInputLng] = useState('');

    useEffect(() => {
        const handleWheel = (event) => {
            if (isZoomed) {
                const newScale = scale + event.deltaY * -0.001; // Ajuste para zoom más preciso
                setScale(Math.max(1.5, Math.min(3, newScale))); // Limitar el zoom
            }
        };
        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [isZoomed, scale]);

    const handleEarthPointerDown = () => {
        setIsDragging(false);
    };

    const handleEarthPointerMove = () => {
        setIsDragging(true);
    };

    const handleEarthPointerUp = (event) => {
        if (!isDragging && isZoomed) {
            // Colocar pin solo si no hubo arrastre
            const point = new THREE.Vector3().copy(event.point).normalize();
            const phi = Math.acos(point.y);
            const theta = Math.atan2(point.z, point.x);
            const lat = 90 - (phi * 180) / Math.PI;
            const lng = (theta * 180) / Math.PI;
            const pinDistance = 1.02; // Un poco sobre la superficie
            setPins((prevPins) => [
                ...prevPins,
                { lat, lng, position: point.clone().multiplyScalar(pinDistance) }
            ]);
        }
    };

    const handleZoomClick = () => {
        if (!isDragging && !isZoomed) {
            setScale(1.5);
            setIsZoomed(true);
        }
    };

    const handleResetClick = () => {
        setScale(1);
        setIsZoomed(false);
    };

    // Función para borrar todos los pines
    const handleClearPins = () => {
        setPins([]);
    };

    // Función para agregar pin desde el input
    const handleAddPin = () => {
        const lat = parseFloat(inputLat);
        const lng = parseFloat(inputLng);
        if (isNaN(lat) || isNaN(lng)) {
            alert('Por favor, ingresa coordenadas válidas');
            return;
        }
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = lng * (Math.PI / 180);
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);
        const pinDistance = 1.02; // Un poco sobre la superficie
        setPins((prevPins) => [
            ...prevPins,
            { lat, lng, position: new THREE.Vector3(x, y, z).multiplyScalar(pinDistance) }
        ]);
        // Limpiar los inputs
        setInputLat('');
        setInputLng('');
    };

    return (
        <>
            <mesh
                ref={earthRef}
                onPointerDown={handleEarthPointerDown}
                onPointerMove={handleEarthPointerMove}
                onPointerUp={handleEarthPointerUp}
                onClick={handleZoomClick}
                scale={[scale, scale, scale]}
            >
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial map={texture} />
            </mesh>

            {pins.map((pin, index) => (
                <React.Fragment key={index}>
                    <mesh position={pin.position.clone().multiplyScalar(scale)}>
                        <sphereGeometry args={[0.005 * scale, 16, 16]} />
                        <meshBasicMaterial color="red" />
                    </mesh>
                    {isZoomed && (
                        <Html position={pin.position.clone().multiplyScalar(scale)}>
                            <div style={{
                                background: 'rgba(0,0,0,0.8)',
                                color: 'white',
                                padding: '5px',
                                borderRadius: '3px',
                                fontSize: '12px',
                                transform: 'translate(10px, -50%)'
                            }}>
                                Lat: {pin.lat.toFixed(2)}, Lng: {pin.lng.toFixed(2)}
                            </div>
                        </Html>
                    )}
                </React.Fragment>
            ))}

            {isZoomed && (
                <Html position={[0, 1.7 * scale, 0]}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <button onClick={handleResetClick} style={{
                            padding: '10px',
                            background: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginBottom: '10px'
                        }}>
                            Reset View
                        </button>
                        <div>
                            <input
                                type="number"
                                value={inputLat}
                                onChange={(e) => setInputLat(e.target.value)}
                                placeholder="Latitud"
                                required
                                style={{
                                    marginRight: '5px', padding: '5px',
                                    color: 'black'
                                }}
                            />
                            <input
                                type="number"
                                value={inputLng}
                                onChange={(e) => setInputLng(e.target.value)}
                                placeholder="Longitud"
                                required
                                style={{
                                    marginRight: '5px', padding: '5px',
                                    color: 'black'
                                }}
                            />
                            <button
                                onClick={handleAddPin}
                                disabled={!inputLat || !inputLng} // Botón deshabilitado si faltan coordenadas
                                style={{
                                    padding: '5px 10px',
                                    background: !inputLat || !inputLng ? '#aaa' : '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: !inputLat || !inputLng ? 'not-allowed' : 'pointer'
                                }}>
                                Añadir Pin
                            </button>
                        </div>
                        <button onClick={handleClearPins} style={{
                            padding: '10px',
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}>
                            Borrar todos los pines
                        </button>
                    </div>
                </Html>
            )}
        </>
    );
}
