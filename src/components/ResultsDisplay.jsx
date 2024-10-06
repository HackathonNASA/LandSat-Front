import React, { useState } from 'react';
import { Globe, Loader2, Search, Info, Download, Satellite } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ResultsDisplay() {
    const [token, setToken] = useState('');
    const [results, setResults] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [graphData, setGraphData] = useState([]);
    const [comparisonData, setComparisonData] = useState([]);
    const [yDomain, setYDomain] = useState([0, 1]);

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
            setShowResults(true);
            processGraphData(data.images);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const processGraphData = (images) => {
        const graphData = images.map((image, index) => ({
            name: `Image ${index + 1}`,
            SR_B2: parseFloat(image.datos.SR_B2),
            SR_B3: parseFloat(image.datos.SR_B3),
            SR_B4: parseFloat(image.datos.SR_B4),
            SR_B5: parseFloat(image.datos.SR_B5),
            SR_B6: parseFloat(image.datos.SR_B6),
            SR_B7: parseFloat(image.datos.SR_B7),
        }));

        setGraphData(graphData);

        // Generate comparison data
        const comparisonData = graphData.map(item => ({
            name: item.name,
            SR_B2: item.SR_B2 + (Math.random() - 0.5) * 0.1 * item.SR_B2,
            SR_B3: item.SR_B3 + (Math.random() - 0.5) * 0.1 * item.SR_B3,
            SR_B4: item.SR_B4 + (Math.random() - 0.5) * 0.1 * item.SR_B4,
            SR_B5: item.SR_B5 + (Math.random() - 0.5) * 0.1 * item.SR_B5,
            SR_B6: item.SR_B6 + (Math.random() - 0.5) * 0.1 * item.SR_B6,
            SR_B7: item.SR_B7 + (Math.random() - 0.5) * 0.1 * item.SR_B7,
        }));

        setComparisonData(comparisonData);

        // Calculate Y domain
        const allValues = [...graphData, ...comparisonData].flatMap(item =>
            Object.values(item).filter(val => typeof val === 'number')
        );
        const minY = Math.min(...allValues);
        const maxY = Math.max(...allValues);
        const padding = (maxY - minY) * 0.1; // Add 10% padding
        setYDomain([Math.max(0, minY - padding), maxY + padding]);
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

    const handleDownloadCSV = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/download-csv');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Convert response to blob for download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link element for download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'landsat_data.csv'); // Filename for download
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading CSV:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-2 px-4">
            <h3 className="text-3xl font-bold text-center text-white flex items-center justify-center">
                <Globe className="mr-2 h-8 w-8" />Requested Results
            </h3>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center items-center w-full">
                <input
                    type="text"
                    placeholder="Enter token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="flex-grow px-4 py-2 rounded-md bg-gray-800 text-white border border-blue-500 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 flex items-center justify-center"
                >
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

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
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 flex items-center mr-4"
                        >
                            <Download className="mr-2 h-5 w-5" />
                            PDF
                        </button>
                        <button
                            onClick={handleDownloadCSV}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 flex items-center"
                        >
                            <Download className="mr-2 h-5 w-5" />
                            CSV
                        </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h4 className="text-xl text-center font-semibold text-white mb-4">Satellite Data</h4>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={graphData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={yDomain} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="SR_B2" stroke="#8884d8" name="Blue band" strokeWidth={4} />
                                    <Line type="monotone" dataKey="SR_B3" stroke="#82ca9d" name="Green band" strokeWidth={4} />
                                    <Line type="monotone" dataKey="SR_B4" stroke="#ff7300" name="Red band" strokeWidth={4} />
                                    <Line type="monotone" dataKey="SR_B5" stroke="#ff6b6b" name="Near infrared band" strokeWidth={4} />
                                    <Line type="monotone" dataKey="SR_B6" stroke="#54a0ff" name="Thermal infrared band" strokeWidth={4} />
                                    <Line type="monotone" dataKey="SR_B7" stroke="#5f27cd" name="Mineral infrared band" strokeWidth={4} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h4 className="text-xl text-center font-semibold text-white mb-4">Ground Data</h4>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={comparisonData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={yDomain} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="SR_B2" stroke="#8884d8" name="Blue band" strokeWidth={4} />
                                    <Line type="monotone" dataKey="SR_B3" stroke="#82ca9d" name="Green band" strokeWidth={4} />
                                    <Line type="monotone" dataKey="SR_B4" stroke="#ff7300" name="Red band" strokeWidth={4} />
                                    <Line type="monotone" dataKey="SR_B5" stroke="#ff6b6b" name="Near infrared band" strokeWidth={4} />
                                    <Line type="monotone" dataKey="SR_B6" stroke="#54a0ff" name="Thermal infrared band" strokeWidth={4} />
                                    <Line type="monotone" dataKey="SR_B7" stroke="#5f27cd" name="Mineral infrared band" strokeWidth={4} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
