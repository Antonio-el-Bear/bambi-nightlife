type TonightSignal = {
  id: 'bookings' | 'buzz' | 'service' | 'ops'
  label: string
  value: string
  detail: string
  iconUrl?: string // optional icon or mini-photo
}

type TonightStripProps = {
  signals: TonightSignal[]
}

export function TonightStrip({ signals }: TonightStripProps) {
  return (
    <section className="card tonight-strip">
      <div className="quick-access-head">
        <span className="eyebrow">Tonight at a glance</span>
      </div>
      <div className="tonight-grid">
        {signals.map((signal) => (
          <article className="tonight-card animated-pulse" data-module={signal.id} key={signal.id}>
            <span className="tonight-icon">
              {signal.iconUrl ? (
                <img src={signal.iconUrl} alt="" />
              ) : (
                <DefaultTonightIcon id={signal.id} />
              )}
            </span>
            <span className="tonight-label">{signal.label}</span>
            <strong>{signal.value}</strong>
            <p>{signal.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

// Default icon fallback for each module
function DefaultTonightIcon({ id }: { id: TonightSignal['id'] }) {
  switch (id) {
    case 'bookings':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="8" width="20" height="14" rx="4" fill="#FFB84D"/><rect x="8" y="4" width="12" height="6" rx="2" fill="#FF5FA2"/></svg>
      )
    case 'buzz':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="10" fill="#FF5FA2"/><circle cx="14" cy="14" r="6" fill="#2DE2E6"/></svg>
      )
    case 'service':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="6" y="10" width="16" height="8" rx="4" fill="#2DE2E6"/><rect x="10" y="6" width="8" height="4" rx="2" fill="#8B5CF6"/></svg>
      )
    case 'ops':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="8" y="8" width="12" height="12" rx="6" fill="#8B5CF6"/><rect x="12" y="4" width="4" height="8" rx="2" fill="#FF5FA2"/></svg>
      )
    default:
      return null
  }
}