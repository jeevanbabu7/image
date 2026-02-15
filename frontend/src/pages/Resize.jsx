import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PreviewBox from "../components/PreviewBox.jsx";
import { resizeImage, downloadFile, unlockFile } from "../services/api.js";
import { downloadBlob, formatBytes } from "../utils/format.js";

function Resize() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [quality, setQuality] = useState(80);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [targetKB, setTargetKB] = useState("");
  const [keepAspect, setKeepAspect] = useState(true);
  const [origSize, setOrigSize] = useState({ width: 0, height: 0 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      setOrigSize({ width: 0, height: 0 });
      return undefined;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setOrigSize({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.src = url;
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const resetResult = () => {
    setResult(null);
    setToken("");
    setError("");
  };

  const handleWidthChange = (value) => {
    setWidth(value);
    if (keepAspect && origSize.width && value) {
      const nextHeight = Math.round((Number(value) * origSize.height) / origSize.width);
      setHeight(String(nextHeight));
    }
  };

  const handleHeightChange = (value) => {
    setHeight(value);
    if (keepAspect && origSize.height && value) {
      const nextWidth = Math.round((Number(value) * origSize.width) / origSize.height);
      setWidth(String(nextWidth));
    }
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
      if (width) {
        formData.append("width", String(width));
      }
      if (height) {
        formData.append("height", String(height));
      }
      if (targetKB) {
        formData.append("targetKB", String(targetKB));
      }
      formData.append("quality", String(quality));
      formData.append("keepAspect", String(keepAspect));

      const data = await resizeImage(formData);
      setResult(data);
    } catch (err) {
      const message = err.message || "Resize failed.";
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
      downloadBlob(blob, filename || "resized.jpg");
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
        <h1 className="page-title">Image Resizer</h1>
        <p className="page-subtitle">Resize by pixels or target size in KB, no login needed.</p>
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
          {file && (
            <span className="helper">
              Original size: {formatBytes(file.size)} | {origSize.width} x {origSize.height}px
            </span>
          )}
        </PreviewBox>

        <PreviewBox title="2. Resize Settings">
          <div className="input-row">
            <label>
              Width (px)
              <input
                type="number"
                min="1"
                placeholder="Optional"
                value={width}
                onChange={(event) => handleWidthChange(event.target.value)}
              />
            </label>
            <label>
              Height (px)
              <input
                type="number"
                min="1"
                placeholder="Optional"
                value={height}
                onChange={(event) => handleHeightChange(event.target.value)}
              />
            </label>
          </div>
          <label>
            <input
              type="checkbox"
              checked={keepAspect}
              onChange={(event) => setKeepAspect(event.target.checked)}
            />
            Maintain aspect ratio
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
            {loading ? "Resizing..." : "Resize image"}
          </button>
        </PreviewBox>
      </form>

      <div className="section full">
        <PreviewBox title="3. Unlock and Download">
          {error && <div className="status error">{error}</div>}
          {result && (
            <div className="status">
              Output size: {formatBytes(result.size)} | {result.mimeType}
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

export default Resize;
