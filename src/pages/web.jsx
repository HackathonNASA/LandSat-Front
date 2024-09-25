import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Crosshair,
  Mail,
  Satellite,
  ExternalLink,
  User,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function LandsatTracker() {
  const canvasRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [locationType, setLocationType] = useState("coordinates");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [notificationMethod, setNotificationMethod] = useState("browser");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });
    renderer.setSize(300, 300);

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const texture = new THREE.TextureLoader().load("/earth-texture.jpg");
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    camera.position.z = 3;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.005;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      controls.dispose();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tracking set up for:", {
      locationType,
      latitude,
      longitude,
      notificationMethod,
    });
  };

  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    console.log("User registered:", { email, password });
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white overflow-hidden">
      {/* Animated stars */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random(),
              transform: `translateY(${scrollY * 0.5}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="flex justify-between items-center p-4 bg-opacity-50 bg-black">
        <div className="text-2xl font-bold">LANDSAT TRACKER</div>
        <div className="flex space-x-4">
          {["HOME", "ABOUT", "TRACK", "NEWS", "CONTACT"].map((item) => (
            <Link key={item} href="#" className="hover:text-gray-300">
              {item}
            </Link>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex justify-between items-center p-12">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-bold mb-4">LANDSAT MISSION</h1>
          <h2 className="text-2xl mb-4">OBSERVING EARTH FROM SPACE</h2>
          <p className="mb-8">
            Track Landsat satellites and receive notifications when they pass
            over your location. Explore the beauty of Earth from a new
            perspective.
          </p>
          <div className="space-x-4">
            <Button variant="secondary">START TRACKING</Button>
            <Button variant="outline">LEARN MORE</Button>
          </div>
        </div>
        <div className="relative">
          <img
            src="/landsat-satellite.png"
            alt="Landsat Satellite"
            className="w-96 h-96 object-cover"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </section>

      <Tabs defaultValue="about" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="track">Track</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        {/* Tabs content: About */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Landsat</CardTitle>
              <CardDescription>
                Earth observation satellite program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Landsat is a series of Earth observation satellites...
              </p>
              <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Continuous global record of Earth's surface</li>
                <li>Medium resolution multispectral data</li>
                <li>Free and open data policy</li>
                <li>
                  Supports various applications in agriculture, geology,
                  forestry, and more
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tabs content: Track */}
        <TabsContent value="track">
          <Card>
            <CardHeader>
              <CardTitle>Track Landsat</CardTitle>
              <CardDescription>
                Set up notifications for Landsat passes over your location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label>Define Target Location</Label>
                  <RadioGroup
                    value={locationType}
                    onValueChange={setLocationType}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="coordinates" id="coordinates" />
                      <Label htmlFor="coordinates">Coordinates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="map" id="map" />
                      <Label htmlFor="map">Interactive Map</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="geolocation" id="geolocation" />
                      <Label htmlFor="geolocation">Use My Location</Label>
                    </div>
                  </RadioGroup>
                </div>

                {locationType === "coordinates" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="text"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        placeholder="e.g., 40.7128"
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="text"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        placeholder="e.g., -74.0060"
                      />
                    </div>
                  </div>
                )}

                {locationType === "geolocation" && (
                  <Button type="button" onClick={handleGeolocation}>
                    Get Current Location
                  </Button>
                )}

                <Separator />

                <div>
                  <Label>Notification Method</Label>
                  <RadioGroup
                    value={notificationMethod}
                    onValueChange={setNotificationMethod}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="browser" id="browser" />
                      <Label htmlFor="browser">Browser</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email">Email</Label>
                    </div>
                  </RadioGroup>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit}>Start Tracking</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tabs content: Register */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>Sign up to receive updates</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegistration} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
                <Button type="submit">Register</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
