export default function ChatLoading() {
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Agent sidebar skeleton */}
      <div style={{ width: 200, borderRight: '1px solid var(--border-dim)', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 40, borderRadius: 'var(--radius-md)' }} />
        ))}
      </div>
      {/* Chat area skeleton */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[80, 60, 90, 50].map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
              <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0 }} />
              <div className="skeleton" style={{ width: `${w}%`, height: 64, borderRadius: 'var(--radius-lg)' }} />
            </div>
          ))}
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-dim)' }}>
          <div className="skeleton" style={{ height: 52, borderRadius: 'var(--radius-xl)' }} />
        </div>
      </div>
    </div>
  );
}
