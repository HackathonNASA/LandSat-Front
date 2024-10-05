import { useState } from 'react';
import { Satellite, Search, Info, Loader2, Download, Globe } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generatePDF = (results) => {
    const doc = new jsPDF();

    // Definir márgenes y configuraciones generales
    const margin = 20;
    const imgWidth = 50; // Ancho de la imagen
    const imgHeight = 50; // Alto de la imagen
    const textIndent = margin + imgWidth + 10; // Espaciado para el texto al lado de la imagen

    // Título del documento
    doc.setFontSize(18);
    doc.text("Landsat", margin, 20);

    // Recorrer las imágenes y descripciones
    results.images.forEach((image, index) => {
        const yPosition = 40 + index * 60; // Espaciado entre cada sección

        // Cargar la imagen
        doc.addImage(image.url, 'JPEG', margin, yPosition, imgWidth, imgHeight);

        // Añadir las descripciones
        doc.setFontSize(12);
        doc.text(`Descripciones:`, textIndent, yPosition);

        // Añadir la lista de descripciones
        image.datos.forEach((dato, i) => {
            doc.text(`${i + 1}. ${dato}`, textIndent, yPosition + (i + 1) * 10);
        });
    });

    // Guardar o mostrar el PDF generado
    doc.save("landsat_results.pdf");
};

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

            // Map the JSON data to the expected image format
            const mappedData = {
                images: jsonData.map((item, index) => ({
                    id: index + 1,
                    title: `Landsat Image - ${item.fecha}`,  // Use 'fecha' as title
                    description: `Landsat data collected on ${item.fecha}`,  // Description with date
                    url: item.url,  // Use URL for image display
                    datos: item.datos  // Include the datos directly
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
            datos: {}  // Initialize as empty object
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

    const handleDownloadPDF = () => {
        generatePDF(results); // Implement this function if not already done
    };

    return (
        <div className="relative z-10 py-4 space-y-6 backdrop-blur-md bg-opacity-20 bg-blue-900 min-h-screen">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-4xl font-bold mb-10 text-center text-white">Results</h1>
                <h3 className="text-3xl font-bold mb-6 text-center text-white flex items-center justify-center">
                    <Globe className="mr-2 h-8 w-8" />
                    NASA Landsat Explorer
                </h3>

                <div className="flex space-x-2 justify-center mb-8">
                    <input
                        type="text"
                        placeholder="Enter token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="max-w-xs px-4 py-3 rounded-md bg-gray-800 text-white border border-blue-500 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {/* Main content layout with 3x3 grid and image details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-opacity-20 bg-blue-900 p-6 rounded-lg shadow-lg border border-blue-500">

                    {/* 3x3 Grid for images only */}
                    <div className="md:col-span-2 grid grid-cols-3 gap-4">
                        {results.images.map((image) => (
                            <div
                                key={image.id}
                                className="relative group cursor-pointer overflow-hidden bg-gray-800 border border-blue-500 rounded-lg h-64" // Fixed height for uniformity
                                onClick={() => setSelectedImage(image)}  // Click to set selected image
                            >
                                {/* Only the image is rendered in the grid */}
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Preview section with all image details */}
                    <div className="bg-gray-800 border border-blue-500 rounded-lg p-4 space-y-4">
                        {/* Mostrar la imagen seleccionada */}
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.title}
                            className="w-full h-auto object-cover rounded-lg mb-4" // Ajusta el tamaño y el estilo
                        />

                        <h4 className="text-xl font-semibold flex items-center space-x-2 text-blue-300">
                            <Info className="w-5 h-5" />
                            <span>{selectedImage.title}</span>
                        </h4>
                        <p className="text-sm text-white">{selectedImage.description}</p>

                        {/* Display image metadata (datos) */}
                        <div className="space-y-2 text-white">
                            {Object.entries(selectedImage.datos).map(([key, value]) => (
                                <p key={key}><strong>{key}:</strong> {value}</p>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Download button */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleDownloadPDF}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 uppercase tracking-wide flex items-center"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download Results as PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
