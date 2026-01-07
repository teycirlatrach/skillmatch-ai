export default function PageShell({ title, right, children, max = "max-w-5xl" }) {
  return (
    <div className="ui-page">
      <div className="ui-bg"></div>

      <div className="ui-container">
        <div className={`w-full ${max}`}>
          {(title || right) && (
            <div className="flex items-center justify-between gap-3 mb-4">
              <h1 style={{ fontSize: 28, fontWeight: 900 }}>{title}</h1>
              <div className="flex gap-2 flex-wrap">{right}</div>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
