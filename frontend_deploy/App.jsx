import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://jetlir-api.onrender.com/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Fehler beim Hochladen oder Verarbeiten des Videos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎬 AutoVideo AI</h1>
      <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} />
      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        {loading ? "Verarbeite..." : "Hochladen & Verarbeiten"}
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Ergebnis</h2>
          <video controls className="w-full mt-2">
            <source src={`https://jetlir-api.onrender.com/${result.cut_video}`} type="video/mp4" />
          </video>
          <p className="mt-4 whitespace-pre-wrap">
            <strong>Untertitel:</strong><br />{result.subtitles}
          </p>
        </div>
      )}
    </div>
  );
}
