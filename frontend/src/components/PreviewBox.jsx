function PreviewBox({ title, children }) {
  return (
    <div className="surface">
      <h3>{title}</h3>
      <div className="inline-grid">{children}</div>
    </div>
  );
}

export default PreviewBox;
