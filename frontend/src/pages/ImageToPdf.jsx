import { useState } from "react";
import { toast } from "react-toastify";
import PreviewBox from "../components/PreviewBox.jsx";
import { downloadFile, imageToPdf, unlockFile } from "../services/api.js";
import { downloadBlob, formatBytes } from "../utils/format.js";

function ImageToPdf() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  const resetResult = () => {
    setResult(null);
    setToken("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!files.length) {
      setError("Please upload at least one image.");
      return;
    }

    setLoading(true);
    setError("");
    setToken("");

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const data = await imageToPdf(formData);
      setResult(data);
    } catch (err) {
      const message = err.message || "PDF conversion failed.";
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
      downloadBlob(blob, filename || "images.pdf");
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

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Image to PDF</h1>
        <p className="page-subtitle">Combine multiple images into a single PDF file.</p>
      </div>

      <form className="section" onSubmit={handleSubmit}>
        <PreviewBox title="1. Upload Images">
          <input
            type="file"
            accept="image/png,image/jpeg"
            multiple
            onChange={(event) => {
              setFiles(Array.from(event.target.files || []));
              resetResult();
            }}
          />
          {files.length > 0 && (
            <div className="inline-grid">
              <span className="helper">{files.length} images selected</span>
              <span className="helper">Total size: {formatBytes(totalSize)}</span>
              <div className="status">
                {files.map((file) => (
                  <div key={file.name}>{file.name}</div>
                ))}
              </div>
            </div>
          )}
        </PreviewBox>

        <PreviewBox title="2. Generate PDF">
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Building PDF..." : "Create PDF"}
          </button>
        </PreviewBox>
      </form>

      <div className="section full">
        <PreviewBox title="3. Unlock and Download">
          {error && <div className="status error">{error}</div>}
          {result && (
            <div className="status">Output size: {formatBytes(result.size)}</div>
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

export default ImageToPdf;
