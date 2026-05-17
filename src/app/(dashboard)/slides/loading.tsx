export default function SlidesLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div className="skeleton" style={{ width: 160, height: 24, borderRadius: 'var(--radius-md)' }} />
        <div className="skeleton" style={{ width: 100, height: 32, borderRadius: 'var(--radius-pill)' }} />
      </div>
      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
