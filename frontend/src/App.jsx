import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import PassportPhoto from "./pages/PassportPhoto.jsx";
import Compress from "./pages/Compress.jsx";
import Resize from "./pages/Resize.jsx";
import ImageToPdf from "./pages/ImageToPdf.jsx";
import "./components/components.css";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/passport-photo" element={<PassportPhoto />} />
          <Route path="/compress" element={<Compress />} />
          <Route path="/resize" element={<Resize />} />
          <Route path="/image-to-pdf" element={<ImageToPdf />} />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}

export default App;
