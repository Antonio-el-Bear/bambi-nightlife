import { useEffect, useState } from 'react'
import type { VenueManagementSettings } from '../types'
import { SectionHeader } from './SectionHeader'

const eventPresets: Array<Pick<VenueManagementSettings, 'featuredEventTitle' | 'featuredEventSummary' | 'featuredEventPosterUrl' | 'featuredEventDate' | 'featuredEventStatus' | 'featuredEventAudience'>> = [
  {
    featuredEventTitle: 'Saturday Noir at Bambi',
    featuredEventSummary: 'Drive premium table demand with black-tie visuals, VIP bottle theatre, and a late-night lounge handoff.',
    featuredEventPosterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    featuredEventDate: '2026-03-21',
    featuredEventStatus: 'live',
    featuredEventAudience: 'VIP regulars and high-spend weekend guests',
  },
  {
    featuredEventTitle: 'Midweek Industry Connect',
    featuredEventSummary: 'Promote softer lounge bookings, hosted arrivals, and premium networking tables for repeat midweek spend.',
    featuredEventPosterUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
    featuredEventDate: '2026-03-25',
    featuredEventStatus: 'scheduled',
    featuredEventAudience: 'Corporate tables, creators, and returning lounge spenders',
  },
  {
    featuredEventTitle: 'Hostess Growth Push',
    featuredEventSummary: 'Shift the campaign toward approved female guest profiles and hosted group arrivals to lift the room earlier.',
    featuredEventPosterUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    featuredEventDate: '2026-03-28',
    featuredEventStatus: 'draft',
    featuredEventAudience: 'Approved female guest profiles and hosted group tables',
  },
]

const waitressOfferPresets: Array<Pick<VenueManagementSettings, 'waitressOfferTitle' | 'waitressOfferDetail' | 'waitressOfferValue'>> = [
  {
    waitressOfferTitle: 'Top table close incentive',
    waitressOfferDetail: 'Reward staff who convert pending VIP requests into confirmed pre-ordered bookings before prime arrival time.',
    waitressOfferValue: 'R750 bonus + bottle-service priority',
  },
  {
    waitressOfferTitle: 'Arrival recovery bonus',
    waitressOfferDetail: 'Reward fast guest check-ins and table recovery when delayed arrivals are turned into seated spend.',
    waitressOfferValue: 'R450 bonus + shift priority next rota',
  },
  {
    waitressOfferTitle: 'Upsell acceleration offer',
    waitressOfferDetail: 'Push pre-order add-ons and late bottle upgrades on confirmed lounge tables to protect nightly revenue.',
    waitressOfferValue: '8% upsell share on qualifying tables',
  },
]

type VenueManagementPanelProps = {
  actorName: string
  settings: VenueManagementSettings
  onUpdate: (updates: Partial<Omit<VenueManagementSettings, 'updatedAt'>>, actor?: string) => void
}

export function VenueManagementPanel({ actorName, settings, onUpdate }: VenueManagementPanelProps) {
  const [featuredEventTitle, setFeaturedEventTitle] = useState(settings.featuredEventTitle)
  const [featuredEventSummary, setFeaturedEventSummary] = useState(settings.featuredEventSummary)
  const [featuredEventPosterUrl, setFeaturedEventPosterUrl] = useState(settings.featuredEventPosterUrl)
  const [featuredEventDate, setFeaturedEventDate] = useState(settings.featuredEventDate)
  const [featuredEventStatus, setFeaturedEventStatus] = useState(settings.featuredEventStatus)
  const [featuredEventAudience, setFeaturedEventAudience] = useState(settings.featuredEventAudience)
  const [waitressOfferTitle, setWaitressOfferTitle] = useState(settings.waitressOfferTitle)
  const [waitressOfferDetail, setWaitressOfferDetail] = useState(settings.waitressOfferDetail)
  const [waitressOfferValue, setWaitressOfferValue] = useState(settings.waitressOfferValue)

  useEffect(() => {
    setFeaturedEventTitle(settings.featuredEventTitle)
    setFeaturedEventSummary(settings.featuredEventSummary)
    setFeaturedEventPosterUrl(settings.featuredEventPosterUrl)
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
          <div className="preset-grid">
            {eventPresets.map((preset) => (
              <button
                key={preset.featuredEventTitle}
                type="button"
                className="preset-button"
                onClick={() => {
                  setFeaturedEventTitle(preset.featuredEventTitle)
                  setFeaturedEventSummary(preset.featuredEventSummary)
                  setFeaturedEventPosterUrl(preset.featuredEventPosterUrl)
                  setFeaturedEventDate(preset.featuredEventDate)
                  setFeaturedEventStatus(preset.featuredEventStatus)
                  setFeaturedEventAudience(preset.featuredEventAudience)
                }}
              >
                {preset.featuredEventTitle}
              </button>
            ))}
          </div>
          <label>
            <span>Event title</span>
            <input value={featuredEventTitle} onChange={(event) => setFeaturedEventTitle(event.target.value)} />
          </label>
          <label>
            <span>Summary</span>
            <textarea rows={4} value={featuredEventSummary} onChange={(event) => setFeaturedEventSummary(event.target.value)} />
          </label>
          <label>
            <span>Poster image URL</span>
            <input value={featuredEventPosterUrl} onChange={(event) => setFeaturedEventPosterUrl(event.target.value)} />
          </label>
          <div className="poster-preview-shell">
            <img alt={featuredEventTitle} className="event-poster preview" src={featuredEventPosterUrl} />
          </div>
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
          <div className="preset-grid">
            {waitressOfferPresets.map((preset) => (
              <button
                key={preset.waitressOfferTitle}
                type="button"
                className="preset-button"
                onClick={() => {
                  setWaitressOfferTitle(preset.waitressOfferTitle)
                  setWaitressOfferDetail(preset.waitressOfferDetail)
                  setWaitressOfferValue(preset.waitressOfferValue)
                }}
              >
                {preset.waitressOfferTitle}
              </button>
            ))}
          </div>
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
