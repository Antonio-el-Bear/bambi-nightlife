import { Link } from 'react-router-dom'
import { SectionHeader } from './SectionHeader'
import type { BookingRecord } from '../types'

type RecentBookingsPanelProps = {
  bookings: BookingRecord[]
}

export function RecentBookingsPanel({ bookings }: RecentBookingsPanelProps) {
  return (
    <section className="card">
      <SectionHeader
        eyebrow="Latest booking activity"
        title="Recent reservations in mock state"
        description="Submissions from the booking form persist locally and immediately feed the wider app."
      />
      <div className="status-grid three-up">
        {bookings.map((booking) => (
          <article className="status-card" key={booking.id}>
            <div className="status-top">
              <strong>{booking.id}</strong>
              <span>{booking.status}</span>
            </div>
            <p>
              {booking.guestName} booked {booking.tableId} for {booking.guests} guests on {booking.date} at {booking.time}.
            </p>
            <div className="action-meta">
              <span>Deposit: {booking.paymentStatus}</span>
              <span>{booking.depositAmount}</span>
            </div>
            <Link className="inline-link" to={`/app/bookings/${booking.id}`}>
              Open details
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}