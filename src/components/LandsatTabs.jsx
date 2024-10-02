import React, {useRef, useState, Suspense, useCallback,  } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

export default function LandsatTabs() {
  const [activeTab, setActiveTab] = useState('track');
  const [locationType, setLocationType] = useState("coordinates");
  const [inputLat, setInputLat] = useState('');
  const [inputLng, setInputLng] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pins, setPins] = useState([]);
  const texture = useLoader(THREE.TextureLoader, '/assets/textures/earthmap1k.jpg');

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

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (locationType === 'coordinates') {
        handleAddPin(); // Solo llama a handleAddPin() sin parámetros
    }
    console.log("Track form submitted");
};
  const handleRegistration = (e) => {
    e.preventDefault();
    console.log("Registration form submitted");
  };

  const handleAddPinGeo = (latitude, longitude) => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng)) {
        alert('Por favor, ingresa coordenadas válidas');
        return;
    }

    // Calcular la posición del pin
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = lng * (Math.PI / 180);
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.cos(phi);
    const z = Math.sin(phi) * Math.sin(theta);
    const pinDistance = 1.02; // Un poco sobre la superficie

    // Añadir el pin
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

    // Calcular la posición del pin
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = lng * (Math.PI / 180);
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.cos(phi);
    const z = Math.sin(phi) * Math.sin(theta);
    const pinDistance = 1.02; // Un poco sobre la superficie

    // Añadir el pin
    setPins((prevPins) => [
        ...prevPins,
        { lat, lng, position: new THREE.Vector3(x, y, z).multiplyScalar(pinDistance) }
    ]);

    // Limpiar los inputs
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
    <div className="max-w-6xl mx-auto">
      <div className="flex border-b mb-4">
        {['Track', 'News'].map((tab) => (
          <button
            key={tab.toLowerCase()}
            className={`px-4 py-2 ${activeTab === tab.toLowerCase() ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {activeTab === 'track' && (
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/2 pr-4">
            <h2 className="text-2xl font-bold mb-2">Track Landsat</h2>
            <p className="text-white mb-4">Set up notifications for Landsat passes over your location</p>
            <form onSubmit={handleTrackSubmit} className="space-y-6">
              <div>
                <p className="font-bold mb-2">Define Target Location</p>
                <div className="flex space-x-4">
                  {['coordinates', 'map', 'geolocation'].map((type) => (
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
                      disabled={!inputLat || !inputLng} // Botón deshabilitado si faltan coordenadas
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

              {locationType === 'geolocation' && (
                <button
                  type="button"
                  onClick={handleGeolocation}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Use My Current Location
                </button>
              )}

              <hr className="my-4" />

              <div>
                <p className="font-bold mb-2">Notification Method</p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Browser Notifications
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Email Notifications
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Set Up Tracking
                </button>
                <button
                  type="button" // Cambiado a type="button"
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
                  Borrar todos los pines
                </button>
                </div>

            </form>
          </div>
          <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
            <div className="h-[500px] bg-gray-800 rounded-lg overflow-hidden">
              <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Suspense fallback={null}>
                  <mesh
                    onPointerDown={handleEarthPointerDown}
                    onPointerMove={handleEarthPointerMove}
                    onPointerUp={handleEarthPointerUp}
                    scale={[scale, scale, scale]} // Scale the Earth
                  >
                    <sphereGeometry args={[1, 64, 64]} />
                    <meshStandardMaterial map={texture} />
                  </mesh>

                {pins.map((pin, index) => (
                <React.Fragment key={index}>
                    <mesh position={pin.position.clone().multiplyScalar(scale)}>
                        <sphereGeometry args={[0.005 * scale, 16, 16]} />
                        <meshBasicMaterial color="red" />
                    </mesh>
                    {(
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

                </Suspense>
                <OrbitControls enableZoom={true} />
              </Canvas>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'news' && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Latest Landsat News</h2>
          <p className="text-white mb-4">Recent updates and upcoming events</p>
          <ul className="space-y-4">
            <li>
              <h3 className="font-semibold">Landsat 9 Successfully Launched</h3>
              <p className="text-sm text-white">September 27, 2021</p>
              <p>Landsat 9, a joint mission between NASA and the U.S. Geological Survey (USGS), launched successfully from Vandenberg Space Force Base in California.</p>
            </li>
            <li>
              <h3 className="font-semibold">Landsat's Critical Role in Mapping Global Water Use</h3>
              <p className="text-sm text-white">August 15, 2023</p>
              <p>Researchers use Landsat data to create the highest resolution map of global water use, helping to address water scarcity issues.</p>
            </li>
            <li>
              <h3 className="font-semibold">Upcoming: Landsat Next Mission</h3>
              <p className="text-sm text-white">Planned for 2030</p>
              <p>NASA and USGS are planning the next generation of Landsat satellites, dubbed Landsat Next, to continue the program's legacy of Earth observation.</p>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}