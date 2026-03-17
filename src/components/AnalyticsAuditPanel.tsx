import { SectionHeader } from './SectionHeader'
import type { OperationsFeedEntry } from '../utils/operationsFeed'
import { formatRelativeAge, getFeedSignal } from '../utils/opsSignals'

type AnalyticsAuditPanelProps = {
  events: OperationsFeedEntry[]
}

export function AnalyticsAuditPanel({ events }: AnalyticsAuditPanelProps) {
  return (
    <div>
      <SectionHeader
        eyebrow="Audit reading"
        title="Recent events behind the metrics"
        description="Analytics now references the same shared audit stream used by operations, so management can connect KPI movement to actual platform events."
      />
      <div className="checklist-grid">
        {events.map((entry) => {
          const signal = getFeedSignal(entry.source, entry.title, entry.detail)

          return (
            <article className="checklist-card" key={entry.id}>
              <strong>{entry.title}</strong>
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
    </div>
  )
}