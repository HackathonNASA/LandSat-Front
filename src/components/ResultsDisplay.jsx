import React, { useState } from 'react';
import { Globe, Loader2, Search, Info, Download, Satellite } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ResultsDisplay() {
    const [token, setToken] = useState('');
    const dataUrl = "http://127.0.0.1:5000/api/get-historical-data";

    const fetchData = async () => {
        try {
            const response = await fetch(dataUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();

            const mappedData = {
                images: jsonData.map((item, index) => ({
                    id: index + 1,
                    title: `Landsat Image - ${item.fecha}`,
                    description: `Landsat data collected on ${item.fecha}`,
                    url: item.url,
                    datos: item.datos
                }))
            };

            return mappedData;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    };

    const [results, setResults] = useState({
        images: Array(9).fill(null).map((_, i) => ({
            id: i + 1,
            title: `Landsat Image ${i + 1}`,
            description: 'Default image. Search to see actual Landsat data.',
            url: '/api/placeholder/400/400',
            datos: {}
        }))
    });

    const [selectedImage, setSelectedImage] = useState(results.images[0]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await fetchData();
            setResults(data);
            setSelectedImage(data.images[0]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = (results) => {
        const doc = new jsPDF();

        // Título centrado en la primera página
        doc.setFontSize(22);
        doc.text("Landsat", 105, 15, { align: "center" });

        results.images.forEach((image, index) => {
            if (index > 0) doc.addPage();

            // Cargar la imagen manteniendo la proporción y ajustando el tamaño
            const imgWidth = 170; // Ancho máximo
            const imgHeight = 100; // Alto máximo

            // Mantener las proporciones de la imagen
            const imgRatio = image.width / image.height;
            let scaledWidth = imgWidth;
            let scaledHeight = imgHeight;

            if (imgRatio > 1) {
                // La imagen es más ancha que alta
                scaledHeight = imgWidth / imgRatio;
            } else {
                // La imagen es más alta que ancha
                scaledWidth = imgHeight * imgRatio;
            }

            doc.addImage(image.url, 'PNG', 20, 30, scaledWidth, scaledHeight);

            // Agregar la descripción
            doc.setFontSize(14); // Fuente para el título de descripción
            doc.text("Descripciones:", 20, 140);

            doc.setFontSize(10); // Fuente más pequeña para la descripción
            let yPosition = 150;
            Object.entries(image.datos).forEach(([key, value], i) => {
                doc.text(`${i + 1}. ${key}: ${value}`, 30, yPosition);
                yPosition += 8; // Espaciado ajustado para texto más pequeño
            });
        });

        doc.save("landsat_results.pdf");
    };


    const handleDownloadPDF = () => {
        generatePDF(results);
    };

    return (
        <div className="min-h-screen bg-black bg-opacity-50 rounded-lg py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-center text-white">Results</h1>
                <h3 className="text-3xl font-bold text-center text-white flex items-center justify-center">
                    <Globe className="mr-2 h-8 w-8" />
                    NASA Landsat Explorer
                </h3>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center items-center">
                    <input
                        type="text"
                        placeholder="Enter token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-800 text-white border border-blue-500 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 grid grid-cols-3 gap-4">
                        {results.images.map((image) => (
                            <div
                                key={image.id}
                                className="relative cursor-pointer overflow-hidden rounded-lg aspect-square group"
                                onClick={() => setSelectedImage(image)}
                            >
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Satellite className="text-white w-12 h-12" />
                                </div>
                                <p className="absolute bottom-0 left-0 right-0 text-white text-sm p-2 truncate bg-black bg-opacity-50">{image.title}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.title}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <h4 className="text-xl font-semibold flex items-center space-x-2 text-blue-300">
                            <Info className="w-5 h-5" />
                            <span>{selectedImage.title}</span>
                        </h4>
                        <p className="text-sm text-white">{selectedImage.description}</p>
                        <div className="space-y-2 text-white">
                            {Object.entries(selectedImage.datos).map(([key, value]) => (
                                <p key={key} className="text-sm"><strong>{key}:</strong> {value}</p>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleDownloadPDF}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 flex items-center"
                    >
                        <Download className="mr-2 h-5 w-5" />
                        Download Results as PDF
                    </button>
                </div>
            </div>
        </div>
    );
}