import React, { useState, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

import EarthBackground from './EarthBackground.jsx';

export default function LocationSelector() {
    const [activeTab, setActiveTab] = useState('track');
    const [locationType, setLocationType] = useState("coordinates");
    const [inputLat, setInputLat] = useState('');
    const [inputLng, setInputLng] = useState('');
    const [pins, setPins] = useState([]);
    const texture = useLoader(THREE.TextureLoader, '/assets/textures/earthmap1k.jpg');
    const textureCloud = useLoader(THREE.TextureLoader, '/assets/textures/earthCloud.png');

    const [scale, setScale] = useState(1.7);
    const [isDragging, setIsDragging] = useState(false);

    const handleEarthPointerDown = () => {
        setIsDragging(false);
    };

    const handleEarthPointerMove = () => {
        setIsDragging(true);
    };

    const handleEarthPointerUp = (event) => {
        if (!isDragging && locationType === 'map') {
            const point = new THREE.Vector3().copy(event.point).normalize();
            const phi = Math.acos(point.y);
            const theta = Math.atan2(point.z, point.x);
            const lat = 90 - (phi * 180) / Math.PI;
            const lng = (theta * 180) / Math.PI;
            const pinDistance = 1.02;
            setPins((prevPins) => [
                ...prevPins,
                { lat, lng, position: point.clone().multiplyScalar(pinDistance) }
            ]);
        }
    };

    const handleTrackSubmit = (e) => {
        e.preventDefault();
        if (locationType === 'coordinates') {
            handleAddPin();
        }
        console.log("Track form submitted");
    };

    const handleAddPinGeo = (latitude, longitude) => {
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        if (isNaN(lat) || isNaN(lng)) {
            alert('Por favor, ingresa coordenadas válidas');
            return;
        }

        const phi = (90 - lat) * (Math.PI / 180);
        const theta = lng * (Math.PI / 180);
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);
        const pinDistance = 1.02;

        setPins((prevPins) => [
            ...prevPins,
            { lat, lng, position: new THREE.Vector3(x, y, z).multiplyScalar(pinDistance) }
        ]);
    };

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
        const pinDistance = 1.02;

        setPins((prevPins) => [
            ...prevPins,
            { lat, lng, position: new THREE.Vector3(x, y, z).multiplyScalar(pinDistance) }
        ]);

        setInputLat('');
        setInputLng('');
    };

    const handleGeolocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(`Ubicación obtenida: ${latitude}, ${longitude}`);
                    handleAddPinGeo(latitude, longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("No se pudo obtener tu ubicación. Por favor, intenta de nuevo.");
                }
            );
        } else {
            alert("Tu navegador no soporta geolocalización.");
        }
    };

    const handleClearPins = () => {
        setPins([]);
    };

    return (
        <section className="relative z-10 py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-1/2 pr-4">
                        <h2 className="text-2xl font-bold mb-2">Landsat</h2>
                        <form onSubmit={handleTrackSubmit} className="space-y-6">
                            <div>
                                <p className="font-bold mb-2">Define Target Location</p>
                                <div className="flex space-x-4">
                                    {['coordinates', 'Path/Row', 'map', 'geolocation'].map((type) => (
                                        <label key={type} className="flex items-center">
                                            <input
                                                type="radio"
                                                value={type}
                                                checked={locationType === type}
                                                onChange={(e) => setLocationType(e.target.value)}
                                                className="mr-2"
                                            />
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {locationType === 'coordinates' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <p className="col-span-2 mb-2">Specify the latitude and longitude of the desired
                                        location</p>
                                    <div>
                                        <label htmlFor="latitude" className="block mb-1">Latitude</label>
                                        <input
                                            type="number"
                                            value={inputLat}
                                            onChange={(e) => setInputLat(e.target.value)}
                                            placeholder="e.g., 40.7128"
                                            className="w-full px-3 py-2 border rounded text-white bg-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="longitude" className="block mb-1">Longitude</label>
                                        <input
                                            type="number"
                                            value={inputLng}
                                            onChange={(e) => setInputLng(e.target.value)}
                                            placeholder="e.g., -74.0060"
                                            className="w-full px-3 py-2 border rounded text-white bg-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <button
                                            onClick={handleAddPin}
                                            disabled={!inputLat || !inputLng}
                                            style={{
                                                padding: '5px 10px',
                                                background: !inputLat || !inputLng ? '#aaa' : '#2196F3',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: !inputLat || !inputLng ? 'not-allowed' : 'pointer'
                                            }}>
                                            Add pin
                                        </button>
                                    </div>
                                </div>
                            )}
                            {locationType === 'Path/Row' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="path" className="block mb-1">Path</label>
                                        <input
                                            type="number"
                                            value={inputLat}
                                            onChange={(e) => setInputLat(e.target.value)}
                                            placeholder="e.g., 20"
                                            className="w-full px-3 py-2 border rounded text-white bg-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="row" className="block mb-1">Row</label>
                                        <input
                                            type="number"
                                            value={inputLng}
                                            onChange={(e) => setInputLng(e.target.value)}
                                            placeholder="e.g., 30"
                                            className="w-full px-3 py-2 border rounded text-white bg-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <button
                                            onClick={handleAddPin}
                                            disabled={!inputLat || !inputLng}
                                            style={{
                                                padding: '5px 10px',
                                                background: !inputLat || !inputLng ? '#aaa' : '#2196F3',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: !inputLat || !inputLng ? 'not-allowed' : 'pointer'
                                            }}>
                                            Add pin
                                        </button>
                                    </div>
                                </div>
                            )}
                            {locationType === 'map' && (
                                <p className="mb-2">Click on the Earth to add a pin</p>
                            )}
                            {locationType === 'geolocation' && (
                                <button
                                    type="button"
                                    onClick={handleGeolocation}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Use My Current Location
                                </button>
                            )}

                            <hr className="my-4"/>

                            <button
                                type="button"
                                onClick={handleClearPins}
                                style={{
                                    padding: '10px',
                                    background: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    marginTop: '10px'
                                }}
                            >
                                Remove all pins
                            </button>
                        </form>
                    </div>
                    <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
                        <div className="h-[350px] bg-gray-600 rounded-lg overflow-hidden">
                            <Canvas>
                                <ambientLight intensity={1.5}/>
                                <pointLight position={[10, 10, 10]}/>
                                <Suspense fallback={null}>
                                    <mesh
                                        onPointerDown={handleEarthPointerDown}
                                        onPointerMove={handleEarthPointerMove}
                                        onPointerUp={handleEarthPointerUp}
                                        scale={[scale, scale, scale]}
                                    >
                                        <sphereGeometry args={[1, 64, 64]} />
                                        <meshStandardMaterial map={texture} />
                                    </mesh>
                                    <mesh scale={[scale, scale, scale]}>
                                        <sphereGeometry args={[1, 64, 64]} />
                                        <meshPhongMaterial
                                            map={textureCloud }
                                            transparent={true}
                                            opacity={0.4}
                                            depthWrite={false}
                                        />
                                    </mesh>

                                    {pins.map((pin, index) => (
                                        <React.Fragment key={index}>
                                            <mesh position={pin.position.clone().multiplyScalar(scale)}>
                                                <sphereGeometry args={[0.005 * scale, 16, 16]} />
                                                <meshBasicMaterial color="red" />
                                            </mesh>
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
                                        </React.Fragment>
                                    ))}
                                </Suspense>
                                <OrbitControls enableZoom={true} />
                            </Canvas>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}