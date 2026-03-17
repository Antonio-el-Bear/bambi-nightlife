type TonightSignal = {
  id: 'bookings' | 'buzz' | 'service' | 'ops'
  label: string
  value: string
  detail: string
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
          <article className="tonight-card" data-module={signal.id} key={signal.id}>
            <span className="tonight-label">{signal.label}</span>
            <strong>{signal.value}</strong>
            <p>{signal.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}