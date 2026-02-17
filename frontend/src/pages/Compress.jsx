import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PreviewBox from "../components/PreviewBox.jsx";
import { compressImage } from "../services/api.js";
import { downloadBlob, formatBytes } from "../utils/format.js";

function Compress() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [quality, setQuality] = useState(70);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const resetResult = () => {
    setResult(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("quality", String(quality));

      // OPTIMIZED: Now receives blob directly
      const { blob, filename } = await compressImage(formData);
      
      // Auto-download immediately
      downloadBlob(blob, filename || "compressed.jpg");
      
      setResult({ size: blob.size, filename });
      toast.success("Image compressed and downloaded!");
    } catch (err) {
      const message = err.message || "Compression failed.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Image Compressor</h1>
        <p className="page-subtitle">Reduce file size without killing quality.</p>
      </div>

      <form className="section" onSubmit={handleSubmit}>
        <PreviewBox title="1. Upload and Preview">
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={(event) => {
              setFile(event.target.files[0] || null);
              resetResult();
            }}
          />
          {previewUrl && <img src={previewUrl} alt="Preview" className="preview" />}
          {file && <span className="helper">Original size: {formatBytes(file.size)}</span>}
        </PreviewBox>

        <PreviewBox title="2. Compression Settings">
          <label>
            Quality ({quality})
            <input
              type="range"
              min="10"
              max="90"
              value={quality}
              onChange={(event) => setQuality(Number(event.target.value))}
            />
          </label>
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Compressing..." : "Compress image"}
          </button>
        </PreviewBox>
      </form>

      <div className="section full">
        <PreviewBox title="3. Result">
          {error && <div className="status error">{error}</div>}
          {result && (
            <div className="status success">
              ✅ Original: {formatBytes(file?.size)} | Compressed: {formatBytes(result.size)}
              <br />
              <span className="helper">File downloaded automatically!</span>
            </div>
          )}
          {!result && !error && (
            <div className="status">
              Compress your image and it will download automatically.
            </div>
          )}
        </PreviewBox>
      </div>
    </div>
  );
}

export default Compress;
