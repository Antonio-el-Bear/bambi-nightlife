import { SectionHeader } from './SectionHeader'
import type { BookingRecord } from '../types'

type ServiceQueuePanelProps = {
  activeQueue: BookingRecord[]
  acceptBooking: (bookingId: string, selectedWaitress: string) => void
  reassignBooking: (bookingId: string) => void
}

export function ServiceQueuePanel({
  activeQueue,
  acceptBooking,
  reassignBooking,
}: ServiceQueuePanelProps) {
  return (
    <section className="card">
      <SectionHeader
        eyebrow="Live service activity"
        title="Accept, decline, or reassign"
        description="The front-end keeps the queue readable on mobile while still giving management the operational detail they need."
      />
      <div className="status-grid three-up">
        {activeQueue.map((booking) => (
          <article className="status-card" key={booking.id}>
            <div className="status-top">
              <strong>{booking.id}</strong>
              <span>{booking.status}</span>
            </div>
            <p>
              {booking.guestName} requested {booking.tableId} for {booking.guests} guests. Current waitress: {booking.selectedWaitress}.
            </p>
            <div className="action-meta">
              <span>Arrival: {booking.attendanceStatus}</span>
              <span>Recovery: {booking.recoveryStatus}</span>
            </div>
            <div className="action-row">
              <button
                type="button"
                className="secondary-button"
                onClick={() => acceptBooking(booking.id, booking.selectedWaitress)}
              >
                Accept
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => reassignBooking(booking.id)}
              >
                Reassign
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}