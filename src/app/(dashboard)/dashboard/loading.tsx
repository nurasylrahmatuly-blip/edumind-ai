export default function DashboardLoading() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="skeleton" style={{ height: 40, width: 260, borderRadius: 'var(--radius-md)' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" style={{ height: 90, borderRadius: 'var(--radius-lg)' }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {[1, 2].map((i) => (
          <div key={i} className="skeleton" style={{ height: 240, borderRadius: 'var(--radius-lg)' }} />
        ))}
      </div>
    </div>
  );
}
