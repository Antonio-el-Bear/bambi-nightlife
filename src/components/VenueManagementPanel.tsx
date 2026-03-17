import { useEffect, useState } from 'react'
import type { VenueManagementSettings } from '../types'
import { SectionHeader } from './SectionHeader'

type VenueManagementPanelProps = {
  actorName: string
  settings: VenueManagementSettings
  onUpdate: (updates: Partial<Omit<VenueManagementSettings, 'updatedAt'>>, actor?: string) => void
}

export function VenueManagementPanel({ actorName, settings, onUpdate }: VenueManagementPanelProps) {
  const [featuredEventTitle, setFeaturedEventTitle] = useState(settings.featuredEventTitle)
  const [featuredEventSummary, setFeaturedEventSummary] = useState(settings.featuredEventSummary)
  const [featuredEventDate, setFeaturedEventDate] = useState(settings.featuredEventDate)
  const [featuredEventStatus, setFeaturedEventStatus] = useState(settings.featuredEventStatus)
  const [featuredEventAudience, setFeaturedEventAudience] = useState(settings.featuredEventAudience)
  const [waitressOfferTitle, setWaitressOfferTitle] = useState(settings.waitressOfferTitle)
  const [waitressOfferDetail, setWaitressOfferDetail] = useState(settings.waitressOfferDetail)
  const [waitressOfferValue, setWaitressOfferValue] = useState(settings.waitressOfferValue)

  useEffect(() => {
    setFeaturedEventTitle(settings.featuredEventTitle)
    setFeaturedEventSummary(settings.featuredEventSummary)
    setFeaturedEventDate(settings.featuredEventDate)
    setFeaturedEventStatus(settings.featuredEventStatus)
    setFeaturedEventAudience(settings.featuredEventAudience)
    setWaitressOfferTitle(settings.waitressOfferTitle)
    setWaitressOfferDetail(settings.waitressOfferDetail)
    setWaitressOfferValue(settings.waitressOfferValue)
  }, [settings])

  return (
    <section className="card">
      <SectionHeader
        eyebrow="Venue management"
        title="Publish campaigns and adjust staff offers without digging through the app"
        description="Management can promote the next event and change the active waitress offer from one control surface. Updates are persisted and pushed back into the shared UI."
      />
      <div className="management-grid">
        <form
          className="management-form"
          onSubmit={(event) => {
            event.preventDefault()
            onUpdate(
              {
                featuredEventTitle,
                featuredEventSummary,
                featuredEventDate,
                featuredEventStatus,
                featuredEventAudience,
              },
              actorName,
            )
          }}
        >
          <span className="eyebrow subtle">Promote an event</span>
          <label>
            <span>Event title</span>
            <input value={featuredEventTitle} onChange={(event) => setFeaturedEventTitle(event.target.value)} />
          </label>
          <label>
            <span>Summary</span>
            <textarea rows={4} value={featuredEventSummary} onChange={(event) => setFeaturedEventSummary(event.target.value)} />
          </label>
          <div className="form-grid">
            <label>
              <span>Event date</span>
              <input type="date" value={featuredEventDate} onChange={(event) => setFeaturedEventDate(event.target.value)} />
            </label>
            <label>
              <span>Status</span>
              <select value={featuredEventStatus} onChange={(event) => setFeaturedEventStatus(event.target.value as VenueManagementSettings['featuredEventStatus'])}>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
              </select>
            </label>
          </div>
          <label>
            <span>Audience</span>
            <input value={featuredEventAudience} onChange={(event) => setFeaturedEventAudience(event.target.value)} />
          </label>
          <div className="form-actions">
            <button type="submit" className="primary-button">Save event campaign</button>
          </div>
        </form>

        <form
          className="management-form"
          onSubmit={(event) => {
            event.preventDefault()
            onUpdate(
              {
                waitressOfferTitle,
                waitressOfferDetail,
                waitressOfferValue,
              },
              actorName,
            )
          }}
        >
          <span className="eyebrow subtle">Waitress offer</span>
          <label>
            <span>Offer title</span>
            <input value={waitressOfferTitle} onChange={(event) => setWaitressOfferTitle(event.target.value)} />
          </label>
          <label>
            <span>Offer detail</span>
            <textarea rows={4} value={waitressOfferDetail} onChange={(event) => setWaitressOfferDetail(event.target.value)} />
          </label>
          <label>
            <span>Value shown to staff</span>
            <input value={waitressOfferValue} onChange={(event) => setWaitressOfferValue(event.target.value)} />
          </label>
          <div className="summary-card accent">
            <span className="eyebrow subtle">Last synced</span>
            <strong>{settings.updatedAt}</strong>
            <p>Service staff will see this offer in their queue view after you save it.</p>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button">Save waitress offer</button>
          </div>
        </form>
      </div>
    </section>
  )
}