import { Link } from 'react-router-dom'
import { SectionHeader } from './SectionHeader'
import type { BookingRecord } from '../types'

type OverviewSnapshotPanelProps = {
  bookings: BookingRecord[]
}

export function OverviewSnapshotPanel({ bookings }: OverviewSnapshotPanelProps) {
  return (
    <section className="card">
      <SectionHeader
        eyebrow="Live snapshot"
        title="What this role can see right now"
        description="The overview screen is now fed by shared application state instead of fixed presentation data."
      />
      <div className="status-grid three-up">
        {bookings.slice(0, 3).map((booking) => (
          <article className="status-card" key={booking.id}>
            <div className="status-top">
              <strong>{booking.id}</strong>
              <span>{booking.status}</span>
            </div>
            <p>
              {booking.guestName} has {booking.tableId} in {booking.area} for {booking.guests} guests at {booking.time}.
            </p>
            <div className="action-meta">
              <span>{booking.attendanceStatus}</span>
              <span>{booking.recoveryStatus}</span>
            </div>
            <Link className="inline-link" to={`/app/bookings/${booking.id}`}>
              Open reservation
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}