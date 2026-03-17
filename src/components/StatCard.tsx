import type { Stat } from '../types'

export function StatCard({ label, value, detail, tone = 'default' }: Stat) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  )
}
