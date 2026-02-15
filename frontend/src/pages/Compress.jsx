import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PreviewBox from "../components/PreviewBox.jsx";
import { compressImage, downloadFile, unlockFile } from "../services/api.js";
import { downloadBlob, formatBytes } from "../utils/format.js";

function Compress() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [quality, setQuality] = useState(70);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

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
    setToken("");
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
    setToken("");

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("quality", String(quality));

      const data = await compressImage(formData);
      setResult(data);
    } catch (err) {
      const message = err.message || "Compression failed.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!token) {
      if (!result?.fileId) {
        return;
      }
    }

    setLoading(true);
    setError("");
    try {
      let nextToken = token;
      if (!nextToken) {
        setUnlocking(true);
        const data = await unlockFile(result.fileId);
        nextToken = data.token;
        setToken(nextToken);
      }
      const { blob, filename } = await downloadFile(nextToken);
      downloadBlob(blob, filename || "compressed.jpg");
      toast.success("Download ready.");
    } catch (err) {
      const message = err.message || "Download failed.";
      setError(message);
      toast.error(message);
    } finally {
      setUnlocking(false);
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
        <PreviewBox title="3. Unlock and Download">
          {error && <div className="status error">{error}</div>}
          {result && (
            <div className="status">
              Original: {formatBytes(file?.size)} | Compressed: {formatBytes(result.size)}
            </div>
          )}
          {result && (
            <div className="inline-grid">
              <button
                className="button"
                type="button"
                disabled={loading || unlocking}
                onClick={handleDownload}
              >
                {loading || unlocking ? "Preparing..." : "Download"}
              </button>
              <span className="helper">Download is ready immediately.</span>
            </div>
          )}
        </PreviewBox>
      </div>
    </div>
  );
}

export default Compress;
