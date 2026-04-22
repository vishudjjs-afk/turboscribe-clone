import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const handleTranscribe = async () => {
    if (!file) return alert("Please select an audio file!");

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Something went wrong. Is the backend running?");
    }
    setLoading(false);
  };

  const handleDownload = () => {
    const blob = new Blob([result.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcription.txt";
    a.click();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎙️ TurboScribe Clone</h1>
      <p style={styles.subtitle}>Upload audio and get instant transcription!</p>

      <div style={styles.card}>
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileChange}
          style={styles.input}
        />

        {file && (
          <p style={styles.fileName}>📁 {file.name}</p>
        )}

        <button
          onClick={handleTranscribe}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "⏳ Transcribing..." : "🚀 Transcribe"}
        </button>

        {error && <p style={styles.error}>{error}</p>}

        {result && (
          <div style={styles.result}>
            <h3>📝 Transcription Result:</h3>
            <p style={styles.text}>{result.text}</p>
            <p style={styles.lang}>🌐 Language: {result.language}</p>
            <button onClick={handleDownload} style={styles.downloadBtn}>
              💾 Download TXT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f0f1a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  title: { color: "#a78bfa", fontSize: "2.5rem", marginBottom: "8px" },
  subtitle: { color: "#888", marginBottom: "30px" },
  card: {
    background: "#1a1a2e",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 0 30px rgba(167,139,250,0.2)",
  },
  input: { width: "100%", marginBottom: "16px", color: "#fff" },
  fileName: { color: "#a78bfa", marginBottom: "16px" },
  button: {
    width: "100%",
    padding: "14px",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
    marginBottom: "16px",
  },
  error: { color: "#f87171" },
  result: {
    marginTop: "20px",
    padding: "20px",
    background: "#0f0f1a",
    borderRadius: "8px",
    color: "#fff",
  },
  text: { lineHeight: "1.8", color: "#e2e8f0" },
  lang: { color: "#a78bfa", marginTop: "10px" },
  downloadBtn: {
    marginTop: "12px",
    padding: "10px 20px",
    background: "#059669",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default App;