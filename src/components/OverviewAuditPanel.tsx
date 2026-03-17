import { SectionHeader } from './SectionHeader'
import type { OperationsFeedEntry } from '../utils/operationsFeed'
import { formatRelativeAge, getFeedSignal } from '../utils/opsSignals'

type OverviewAuditPanelProps = {
  events: OperationsFeedEntry[]
}

export function OverviewAuditPanel({ events }: OverviewAuditPanelProps) {
  return (
    <section className="card">
      <SectionHeader
        eyebrow="Shared audit stream"
        title="Top operating events across the platform"
        description="The overview now consumes the same audit feed as the operations screen, so leadership gets one consistent picture of recent activity."
      />
      <div className="status-grid three-up">
        {events.map((entry) => {
          const signal = getFeedSignal(entry.source, entry.title, entry.detail)

          return (
            <article className="status-card" key={entry.id}>
              <div className="status-top">
                <strong>{entry.title}</strong>
                <span>{entry.at}</span>
              </div>
              <p>{entry.detail}</p>
              <div className="action-meta compact-meta">
                <span>{entry.source}</span>
                <span>{entry.category}</span>
                {entry.actor ? <span>{entry.actor}</span> : null}
                <span>{formatRelativeAge(entry.at)}</span>
                <span className={`signal-badge tone-${signal.tone}`}>{signal.label}</span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}