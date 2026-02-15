import ToolCard from "../components/ToolCard.jsx";

function Home() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">All-in-one Image Tools</h1>
        <p className="page-subtitle">
          Fast, clean, and AdSense-safe tools to process images without leaving the browser.
        </p>
      </div>

      <div className="card-grid">
        <ToolCard
          title="Passport Photo"
          description="Get 35x45 mm or 2x2 inch photos with white background."
          to="/passport-photo"
          tag="Govt-ready"
        />
        <ToolCard
          title="Image Compressor"
          description="Shrink files with smart quality controls."
          to="/compress"
          tag="Fast"
        />
        <ToolCard
          title="Image Resizer"
          description="Resize by pixels or target size in KB."
          to="/resize"
          tag="Flexible"
        />
        <ToolCard
          title="Image to PDF"
          description="Combine multiple images into a single PDF."
          to="/image-to-pdf"
          tag="PDF"
        />
      </div>
    </div>
  );
}

export default Home;
