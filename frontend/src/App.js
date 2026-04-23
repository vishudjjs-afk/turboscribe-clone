import { useState, useCallback } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);

  // ✅ Step 23 — Drag & Drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragging(true);
    } else if (e.type === "dragleave") {
      setDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setResult(null);
      setError(null);
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  // ✅ Step 24 — Progress bar simulation
  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 800);
    return interval;
  };

  const handleTranscribe = async () => {
    if (!file) return alert("Please select an audio file!");
    setLoading(true);
    setError(null);
    setResult(null);

    const interval = simulateProgress();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setResult(data);
        setLoading(false);
        setProgress(0);
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setError("Backend not running! Start uvicorn first.");
      setLoading(false);
      setProgress(0);
    }
  };

  // ✅ Step 25 — Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    // ✅ Step 26 — Mobile friendly layout
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🎙️ TurboScribe Clone</h1>
        <p style={styles.subtitle}>
          AI-powered audio & video transcription
        </p>
      </div>

      {/* Main Card */}
      <div style={styles.card}>

        {/* Step 23 — Drag & Drop Zone */}
        <div
          style={{
            ...styles.dropZone,
            borderColor: dragging ? "#a78bfa" : "#3a3a5c",
            background: dragging ? "rgba(167,139,250,0.1)" : "transparent",
          }}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <div style={styles.dropIcon}>
            {file ? "🎵" : "📂"}
          </div>
          {file ? (
            <>
              <p style={styles.fileName}>{file.name}</p>
              <p style={styles.fileSize}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>
          ) : (
            <>
              <p style={styles.dropText}>
                Drag & drop your audio or video file here
              </p>
              <p style={styles.dropSubText}>
                or click to browse — MP3, MP4, WAV, M4A supported
              </p>
            </>
          )}
          <input
            id="fileInput"
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Step 24 — Progress Bar */}
        {loading && (
          <div style={styles.progressContainer}>
            <div style={styles.progressHeader}>
              <span style={styles.progressLabel}>
                ⏳ Transcribing...
              </span>
              <span style={styles.progressPercent}>{progress}%</span>
            </div>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Transcribe Button */}
        <button
          onClick={handleTranscribe}
          disabled={loading || !file}
          style={{
            ...styles.button,
            opacity: loading || !file ? 0.6 : 1,
            cursor: loading || !file ? "not-allowed" : "pointer",
          }}
        >
          {loading ? `⏳ Processing... ${progress}%` : "🚀 Transcribe Now"}
        </button>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={styles.resultBox}>
            <div style={styles.resultHeader}>
              <h3 style={styles.resultTitle}>📝 Transcription Result</h3>
              <span style={styles.langBadge}>
                🌐 {result.language?.toUpperCase()}
              </span>
            </div>

            <p style={styles.resultText}>{result.text}</p>

            {/* Step 25 — Action Buttons */}
            <div style={styles.actionRow}>
              {/* Copy Button */}
              <button onClick={handleCopy} style={styles.copyBtn}>
                {copied ? "✅ Copied!" : "📋 Copy Text"}
              </button>

              {/* Download Button */}
              <button onClick={handleDownload} style={styles.downloadBtn}>
                💾 Download TXT
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <p style={styles.footer}>
        Built with ❤️ using React + FastAPI + OpenAI Whisper
      </p>
    </div>
  );
}

// ✅ Step 26 — Mobile-friendly styles
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  title: {
    color: "#a78bfa",
    fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
    marginBottom: "8px",
    fontWeight: "700",
  },
  subtitle: {
    color: "#888",
    fontSize: "clamp(0.9rem, 2vw, 1rem)",
  },
  card: {
    background: "#16213e",
    borderRadius: "20px",
    padding: "clamp(20px, 5vw, 40px)",
    width: "100%",
    maxWidth: "680px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    border: "1px solid #2a2a4a",
    boxSizing: "border-box",
  },
  dropZone: {
    border: "2px dashed #3a3a5c",
    borderRadius: "12px",
    padding: "40px 20px",
    textAlign: "center",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "all 0.3s ease",
  },
  dropIcon: {
    fontSize: "48px",
    marginBottom: "12px",
  },
  dropText: {
    color: "#c4b5fd",
    fontSize: "1rem",
    marginBottom: "6px",
  },
  dropSubText: {
    color: "#666",
    fontSize: "0.85rem",
  },
  fileName: {
    color: "#a78bfa",
    fontWeight: "600",
    fontSize: "1rem",
    marginBottom: "4px",
    wordBreak: "break-all",
  },
  fileSize: {
    color: "#888",
    fontSize: "0.85rem",
  },
  progressContainer: {
    marginBottom: "16px",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  progressLabel: {
    color: "#a78bfa",
    fontSize: "0.9rem",
  },
  progressPercent: {
    color: "#a78bfa",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  progressBar: {
    background: "#2a2a4a",
    borderRadius: "999px",
    height: "8px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
    borderRadius: "999px",
    transition: "width 0.4s ease",
  },
  button: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #7c3aed, #9d4edd)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "16px",
    transition: "transform 0.2s",
  },
  errorBox: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#f87171",
    marginBottom: "16px",
    fontSize: "0.9rem",
  },
  resultBox: {
    background: "#0f0f1a",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #2a2a4a",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    flexWrap: "wrap",
    gap: "8px",
  },
  resultTitle: {
    color: "#fff",
    margin: 0,
    fontSize: "1rem",
  },
  langBadge: {
    background: "rgba(167,139,250,0.2)",
    color: "#a78bfa",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: "600",
  },
  resultText: {
    color: "#e2e8f0",
    lineHeight: "1.8",
    fontSize: "0.95rem",
    marginBottom: "16px",
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  copyBtn: {
    flex: 1,
    padding: "10px",
    background: "rgba(167,139,250,0.2)",
    color: "#a78bfa",
    border: "1px solid rgba(167,139,250,0.3)",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    minWidth: "120px",
  },
  downloadBtn: {
    flex: 1,
    padding: "10px",
    background: "rgba(5,150,105,0.2)",
    color: "#34d399",
    border: "1px solid rgba(5,150,105,0.3)",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    minWidth: "120px",
  },
  footer: {
    color: "#444",
    fontSize: "0.8rem",
    marginTop: "24px",
    textAlign: "center",
  },
};

export default App;