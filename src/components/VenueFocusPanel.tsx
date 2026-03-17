import type { VenueManagementSettings } from '../types'
import { SectionHeader } from './SectionHeader'

type VenueFocusPanelProps = {
  settings: VenueManagementSettings
}

export function VenueFocusPanel({ settings }: VenueFocusPanelProps) {
  return (
    <section className="card split-layout wide-right">
      <div>
        <SectionHeader
          eyebrow="Venue focus"
          title="What the venue is pushing right now"
          description="Everyone sees the same featured campaign and service incentive, so staff and guests stay aligned on the current commercial focus."
        />
        <div className="summary-card accent">
          <span className="eyebrow subtle">Featured event</span>
          <strong>{settings.featuredEventTitle}</strong>
          <p>{settings.featuredEventSummary}</p>
          <div className="action-meta">
            <span>{settings.featuredEventStatus}</span>
            <span>{settings.featuredEventDate}</span>
            <span>{settings.featuredEventAudience}</span>
          </div>
        </div>
      </div>
      <aside className="summary-card">
        <span className="eyebrow subtle">Current waitress offer</span>
        <strong>{settings.waitressOfferTitle}</strong>
        <p>{settings.waitressOfferDetail}</p>
        <div className="action-meta">
          <span>{settings.waitressOfferValue}</span>
          <span>Updated {settings.updatedAt}</span>
        </div>
      </aside>
    </section>
  )
}