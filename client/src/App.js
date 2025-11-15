import { useState } from "react";
import axios from "axios";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || selectedFile.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a PDF first.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL;

      const response = await axios.post(
        `${API_URL}/api/ai/summarize`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSummary(response.data.summary);
    } catch (err) {
      console.error("Error summarizing PDF:", err);
      alert("Failed to summarize PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">
        📘 AI PDF Summarizer
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center"
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full border border-gray-300 rounded-md p-2 mb-4"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Summarizing..." : "Summarize PDF"}
        </button>
      </form>

      {previewUrl && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            PDF Preview:
          </h2>
          <div className="border rounded-lg shadow-sm p-2 bg-white h-[600px] overflow-y-scroll">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer fileUrl={previewUrl} />
            </Worker>
          </div>
        </div>
      )}

      {summary && (
        <div className="mt-8 w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            🧠 Summary
          </h2>
          <p className="text-gray-800 whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  );
}
