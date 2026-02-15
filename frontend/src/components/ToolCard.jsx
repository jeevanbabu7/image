import { Link } from "react-router-dom";

function ToolCard({ title, description, to, tag }) {
  return (
    <Link to={to} className="tool-card">
      <div className="tool-card__tag">{tag}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
}

export default ToolCard;
