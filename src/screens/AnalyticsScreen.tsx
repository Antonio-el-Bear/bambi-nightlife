import { AnalyticsAuditPanel } from '../components/AnalyticsAuditPanel'
import { AnalyticsPerformancePanel } from '../components/AnalyticsPerformancePanel'
import { SectionHeader } from '../components/SectionHeader'
import { StatCard } from '../components/StatCard'
import { analyticsNotes } from '../data/platformData'
import { useAnalyticsModel } from '../hooks/useAnalyticsModel'

export function AnalyticsScreen() {
  const { dynamicKpis, recentAuditEvents } = useAnalyticsModel()

  return (
    <div className="screen-stack">
      <section className="card">
        <SectionHeader
          eyebrow="Management reporting"
          title="Metrics that map to the real commercial model"
          description="The analytics layer follows the brief directly: bookings, area revenue, hostess performance, service responsiveness, and penalty recovery."
        />
        <div className="stats-grid four-up">
          {dynamicKpis.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="card split-layout wide-right">
        <AnalyticsPerformancePanel />
        <AnalyticsAuditPanel events={recentAuditEvents} />
      </section>

      <section className="card">
        <SectionHeader
          eyebrow="Management notes"
          title="What leadership should review every week"
          description="These notes keep the reporting layer tied to action rather than vanity metrics."
        />
        <div className="checklist-grid">
          {analyticsNotes.map((note) => (
            <article className="checklist-card" key={note.title}>
              <strong>{note.title}</strong>
              <p>{note.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
