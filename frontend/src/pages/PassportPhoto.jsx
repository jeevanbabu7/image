import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PreviewBox from "../components/PreviewBox.jsx";
import { createPassport } from "../services/api.js";
import { downloadBlob, formatBytes } from "../utils/format.js";

function PassportPhoto() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [preset, setPreset] = useState("passport");
  const [quality, setQuality] = useState(80);
  const [targetKB, setTargetKB] = useState("");
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
      formData.append("preset", preset);
      formData.append("quality", String(quality));
      if (targetKB) {
        formData.append("targetKB", String(targetKB));
      }

      // OPTIMIZED: Now receives blob directly
      const { blob, filename } = await createPassport(formData);
      
      // Auto-download immediately
      downloadBlob(blob, filename || "passport-photo.jpg");
      
      setResult({ size: blob.size, filename });
      toast.success("Passport photo created and downloaded!");
    } catch (err) {
      const message = err.message || "Failed to process image.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Passport / Government Photo</h1>
        <p className="page-subtitle">Upload and get ID-ready images with a clean white background.</p>
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

        <PreviewBox title="2. Options">
          <label>
            Preset
            <select value={preset} onChange={(event) => setPreset(event.target.value)}>
              <option value="passport">Passport photo (35x45 mm)</option>
              <option value="twoInch">2x2 inch photo</option>
            </select>
          </label>
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
          <label>
            Target size (KB)
            <input
              type="number"
              min="10"
              placeholder="Optional"
              value={targetKB}
              onChange={(event) => setTargetKB(event.target.value)}
            />
          </label>
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Processing..." : "Create photo"}
          </button>
        </PreviewBox>
      </form>

      <div className="section full">
        <PreviewBox title="3. Result">
          {error && <div className="status error">{error}</div>}
          {result && (
            <div className="status success">
              ✅ Output size: {formatBytes(result.size)}
              <br />
              <span className="helper">File downloaded automatically!</span>
            </div>
          )}
          {!result && !error && (
            <div className="status">
              Create your passport photo and it will download automatically.
            </div>
          )}
        </PreviewBox>
      </div>
    </div>
  );
}

export default PassportPhoto;
