import React, { useState, Suspense, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Earth = dynamic(() => import('./Earth'), { ssr: false });

export default function LandsatTabs() {
  const [activeTab, setActiveTab] = useState('track');
  const [locationType, setLocationType] = useState("coordinates");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pins, setPins] = useState([]);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (locationType === 'coordinates') {
      handleAddPin(parseFloat(latitude), parseFloat(longitude));
    }
    console.log("Track form submitted");
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    console.log("Registration form submitted");
  };

  const handleAddPin = useCallback((lat, lng) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = lng * (Math.PI / 180);
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.cos(phi);
    const z = Math.sin(phi) * Math.sin(theta);
    const pinDistance = 1.02;
    const newPin = { 
      lat, 
      lng, 
      position: new THREE.Vector3(x, y, z).multiplyScalar(pinDistance) 
    };
    setPins(prevPins => [...prevPins, newPin]);
    setLatitude("");
    setLongitude("");
  }, []);

  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleAddPin(latitude, longitude);
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

  const clearAllPins = () => {
    setPins([]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex border-b mb-4">
        {['Track', 'About', 'News', 'Links', 'Register'].map((tab) => (
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
                      id="latitude"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="e.g., 40.7128"
                      className="w-full px-3 py-2 border rounded text-white bg-gray-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="longitude" className="block mb-1">Longitude</label>
                    <input
                      id="longitude"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="e.g., -74.0060"
                      className="w-full px-3 py-2 border rounded text-white bg-gray-700"
                    />
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
                  type="button"
                  onClick={clearAllPins}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Clear All Pins
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
                  <Earth 
                    locationType={locationType} 
                    onAddPin={handleAddPin} 
                    pins={pins}
                    clearPins={clearAllPins}
                  />
                </Suspense>
                <OrbitControls enableZoom={true} />
              </Canvas>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <div>
          <h2 className="text-2xl font-bold mb-2">About Landsat</h2>
          <p className="text-white mb-4">Earth observation satellite program</p>
          <p className="mb-4">Landsat is a series of Earth observation satellites jointly managed by NASA and the U.S. Geological Survey. The Landsat program has been providing continuous global coverage since 1972, making it the longest-running enterprise for acquisition of satellite imagery of Earth.</p>
          <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Continuous global record of Earth's surface</li>
            <li>Medium resolution multispectral data</li>
            <li>Free and open data policy</li>
            <li>Supports various applications in agriculture, geology, forestry, regional planning, education, mapping, and global change research</li>
          </ul>
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

      {activeTab === 'links' && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Useful Links</h2>
          <p className="text-white mb-4">Learn more about Landsat from official sources</p>
          <ul className="space-y-4">
            <li>
              <a href="https://en.wikipedia.org/wiki/Landsat_program" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Landsat on Wikipedia
              </a>
            </li>
            <li>
              <a href="https://landsat.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                NASA Landsat Science
              </a>
            </li>
            <li>
              <a href="https://www.usgs.gov/core-science-systems/nli/landsat" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                USGS Landsat Missions
              </a>
            </li>
            <li>
              <a href="https://earth.esa.int/eogateway/missions/landsat" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                European Space Agency - Landsat
              </a>
            </li>
          </ul>
        </div>
      )}

      {activeTab === 'register' && (
        <div>
          <h2 className="text-2xl font-bold mb-2">User Registration</h2>
          <p className="text-white mb-4">Sign up to receive email notifications and save your preferences</p>
          <form onSubmit={handleRegistration} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-sm text-white">By registering, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      )}
    </div>
  );
}