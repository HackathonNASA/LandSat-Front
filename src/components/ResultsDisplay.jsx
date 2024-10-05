import { useState } from 'react'
import { Satellite, Search, Info, Loader2, Download, Globe } from 'lucide-react'

const fetchData = async (token) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    images: Array(9).fill(null).map((_, i) => ({
      id: i + 1,
      title: `Landsat Image ${i + 1}`,
      description: `Captured on ${new Date().toLocaleDateString()}. Shows ${['forests', 'urban areas', 'coastlines', 'agricultural lands', 'glaciers'][Math.floor(Math.random() * 5)]}.`,
      metadata: {
        satellite: `Landsat ${Math.floor(Math.random() * 3) + 7}`,
        resolution: `${Math.floor(Math.random() * 10) + 20}m`,
        spectralBands: Math.floor(Math.random() * 4) + 7
      }
    })),
  }
}

const generatePDF = (data) => {
  console.log('Generating PDF with data:', data)
  alert('PDF download started (simulated)')
}

export default function ResultsDisplay() {
  const [token, setToken] = useState('')
  const [results, setResults] = useState({
    images: Array(9).fill(null).map((_, i) => ({
      id: i + 1,
      title: `Landsat Image ${i + 1}`,
      description: 'Default image. Search to see actual Landsat data.',
      metadata: {
        satellite: 'N/A',
        resolution: 'N/A',
        spectralBands: 'N/A'
      }
    }))
  })
  const [selectedImage, setSelectedImage] = useState(results.images[0])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    try {
      const data = await fetchData(token)
      setResults(data)
      setSelectedImage(data.images[0])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = () => {
    generatePDF(results)
  }

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-opacity-20 bg-blue-900 p-6 rounded-lg shadow-lg border border-blue-500">
          <div className="md:col-span-2 grid grid-cols-3 gap-4">
            {results.images.map((image) => (
              <div
                key={image.id}
                className="relative group cursor-pointer overflow-hidden bg-gray-800 border border-blue-500 rounded-lg"
                onClick={() => setSelectedImage(image)}
              >
                <div className="p-2">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Satellite className="text-white w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-800 border border-blue-500 rounded-lg p-4 space-y-4">
            <h4 className="text-xl font-semibold flex items-center space-x-2 text-blue-300">
              <Info className="w-5 h-5" />
              <span>{selectedImage.title}</span>
            </h4>
            <p className="text-sm text-white">{selectedImage.description}</p>
            <div className="space-y-2 text-white">
              <p><strong>Satellite:</strong> {selectedImage.metadata.satellite}</p>
              <p><strong>Resolution:</strong> {selectedImage.metadata.resolution}</p>
              <p><strong>Spectral Bands:</strong> {selectedImage.metadata.spectralBands}</p>
            </div>
          </div>
        </div>

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
  )
}