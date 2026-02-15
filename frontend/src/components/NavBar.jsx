import { NavLink } from "react-router-dom";

const links = [
  { to: "/passport-photo", label: "Passport Photo" },
  { to: "/compress", label: "Compress" },
  { to: "/resize", label: "Resize" },
  { to: "/image-to-pdf", label: "Image to PDF" }
];

function NavBar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="logo">
          ImageTools.in
        </NavLink>
        <nav className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
