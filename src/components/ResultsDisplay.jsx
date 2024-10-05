import React, { useState } from 'react';
import { Globe, Loader2, Search, Info, Download, Satellite } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ResultsDisplay() {
    const [token, setToken] = useState('');
    const [results, setResults] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

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

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await fetchData();
            setResults(data);
            setSelectedImage(data.images[0]);
            setShowResults(true); // Mostrar los resultados tras la búsqueda
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = async (results) => {
        const doc = new jsPDF();

        // Title centered on the first page
        doc.setFontSize(22);
        doc.text("Landsat", 105, 15, { align: "center" });

        // Function to load image and get its dimensions
        const loadImage = (url) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.src = url;

                img.onload = () => {
                    resolve(img);
                };

                img.onerror = (error) => {
                    reject(error);
                };
            });
        };

        for (const [index, image] of results.images.entries()) {
            if (index > 0) doc.addPage(); // Add new page after the first

            try {
                // Load the image
                const imgElement = await loadImage(image.url);
                const imgWidth = imgElement.width;
                const imgHeight = imgElement.height;

                // Maintain aspect ratio and scale the image
                const maxWidth = 170;
                const maxHeight = 100;
                let scaledWidth = imgWidth;
                let scaledHeight = imgHeight;

                const imgRatio = imgWidth / imgHeight;

                if (imgRatio > 1) {
                    // Image is wider than tall
                    scaledWidth = maxWidth;
                    scaledHeight = maxWidth / imgRatio;
                } else {
                    // Image is taller than wide
                    scaledHeight = maxHeight;
                    scaledWidth = maxHeight * imgRatio;
                }

                // Add the image to the PDF
                doc.addImage(imgElement, 'PNG', 20, 30, scaledWidth, scaledHeight);

                // Add title for the data
                doc.setFontSize(14);
                doc.text("Data:", 20, 140);

                // Split data into two columns
                const entries = Object.entries(image.datos);
                const half = Math.ceil(entries.length / 2); // Halfway point for splitting the data

                // First column (left)
                let yPosition = 150;
                doc.setFontSize(10);
                entries.slice(0, half).forEach(([key, value], i) => {
                    doc.text(`${i + 1}. ${key}: ${value}`, 30, yPosition);
                    yPosition += 8; // Space between entries
                });

                // Second column (right)
                let yPositionRight = 150; // Same starting position for the second column
                const secondColumnOffset = 110; // Offset to move the text to the right column
                entries.slice(half).forEach(([key, value], i) => {
                    doc.text(`${half + i + 1}. ${key}: ${value}`, secondColumnOffset, yPositionRight);
                    yPositionRight += 8; // Space between entries in the right column
                });

            } catch (error) {
                console.error('Error loading image:', error);
                doc.text(`Error loading image: ${image.url}`, 20, 30); // Display an error in PDF if the image fails to load
            }
        }

        // Save the PDF
        doc.save("landsat_results.pdf");
    };


    const handleDownloadPDF = () => {
        generatePDF(results);
    };

    return (
        <div className="bg-black bg-opacity-50 rounded-lg py-8 px-4">
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

                {/* Mostrar solo si se han obtenido resultados */}
                {showResults && (
                    <>
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

                            <div className="bg-gray-800 rounded-lg p-4 space-y-4 max-h-[750px] overflow-y-auto">
                                <img
                                    src={selectedImage.url}
                                    alt={selectedImage.title}
                                    className="w-auto h-auto max-h-96 object-contain rounded-lg"
                                />
                                <h4 className="text-xl font-semibold flex items-center space-x-2 text-blue-300">
                                    <Info className="w-5 h-5" />
                                    <span>{selectedImage.title}</span>
                                </h4>
                                <p className="text-sm text-white">{selectedImage.description}</p>

                                {/* Make this section scrollable */}
                                <div className="space-y-2 text-white">
                                    {Object.entries(selectedImage.datos).map(([key, value]) => (
                                        <p key={key} className="text-sm">
                                            <strong>{key}:</strong> {value}
                                        </p>
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
                    </>
                )}
            </div>
        </div>
    );
}
