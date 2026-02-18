import { useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = "http://localhost:8000/api/v1"

function App() {
  const [text, setText] = useState("")
  const [result, setResult] = useState(null)
  const [csvFile, setCsvFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const processText = async () => {
    if (!text) return
    setLoading(true)
    try {
      const resp = await axios.post(`${API_URL}/process-text?content=${encodeURIComponent(text)}`)
      setResult(resp.data)
    } catch (err) {
      console.error(err)
      alert("Error processing text")
    } finally {
      setLoading(false)
    }
  }

  const uploadCsv = async () => {
    if (!csvFile) return
    setLoading(true)
    const formData = new FormData()
    formData.append("file", csvFile)

    try {
      const resp = await axios.post(`${API_URL}/process-csv`, formData, {
        responseType: 'blob'
      })

      // Download file
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'processed_results.csv');
      document.body.appendChild(link);
      link.click();

    } catch (err) {
      console.error(err)
      alert("Error processing CSV")
    } finally {
      setLoading(false)
    }
  }

  const search = async () => {
    if (!searchQuery) return
    try {
      const resp = await axios.get(`${API_URL}/search?q=${searchQuery}`)
      setSearchResults(resp.data)
    } catch (err) {
      console.error(err)
      alert("Error searching")
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">Parallel Text Processor</h1>

      {/* Single Text Processing */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl mb-4 font-semibold">Single Text Analysis</h2>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
          rows="4"
          placeholder="Enter text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={processText}
          disabled={loading}
        >
          {loading ? "Processing..." : "Analyze"}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p><strong>Score:</strong> {result.sentiment_score?.toFixed(2)}</p>
            <p><strong>Chunks:</strong> {result.chunk_count}</p>
            <p><strong>Patterns:</strong> {JSON.stringify(result.detected_patterns)}</p>
          </div>
        )}
      </div>

      {/* CSV Upload */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl mb-4 font-semibold">Batch CSV Processing</h2>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={uploadCsv}
          disabled={loading || !csvFile}
        >
          {loading ? "Processing..." : "Upload & Process"}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl mb-4 font-semibold">Search History</h2>
        <div className="flex gap-2">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={search}
          >
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-4">
            {searchResults.map((item) => (
              <div key={item.id} className="border-b py-2">
                <p className="truncate">{item.content}</p>
                <div className="text-sm text-gray-600">
                  Score: {item.sentiment_score?.toFixed(2)} | Patterns: {JSON.stringify(item.detected_patterns)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
