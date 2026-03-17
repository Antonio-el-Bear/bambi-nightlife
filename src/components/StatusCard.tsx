import type { QueueItem } from '../types'

export function StatusCard({ title, detail, meta, tone = 'default' }: QueueItem) {
  return (
    <article className={`status-card tone-${tone}`}>
      <div className="status-top">
        <strong>{title}</strong>
        <span>{meta}</span>
      </div>
      <p>{detail}</p>
    </article>
  )
}
