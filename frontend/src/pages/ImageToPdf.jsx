import { useState } from "react";
import { toast } from "react-toastify";
import PreviewBox from "../components/PreviewBox.jsx";
import { imageToPdf } from "../services/api.js";
import { downloadBlob, formatBytes } from "../utils/format.js";

function ImageToPdf() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetResult = () => {
    setResult(null);
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

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      // OPTIMIZED: Now receives blob directly
      const { blob, filename } = await imageToPdf(formData);
      
      // Auto-download immediately
      downloadBlob(blob, filename || "images.pdf");
      
      setResult({ size: blob.size, filename });
      toast.success("PDF created and downloaded!");
    } catch (err) {
      const message = err.message || "PDF conversion failed.";
      setError(message);
      toast.error(message);
    } finally {
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
        <PreviewBox title="3. Result">
          {error && <div className="status error">{error}</div>}
          {result && (
            <div className="status success">
              ✅ PDF size: {formatBytes(result.size)}
              <br />
              <span className="helper">File downloaded automatically!</span>
            </div>
          )}
          {!result && !error && (
            <div className="status">
              Create your PDF and it will download automatically.
            </div>
          )}
        </PreviewBox>
      </div>
    </div>
  );
}

export default ImageToPdf;
