import { Link, useNavigate, useParams } from 'react-router-dom'
import { SectionHeader } from '../components/SectionHeader'
import { useBookingActions } from '../hooks/useBookingActions'

export function BookingDetailScreen() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const {
    bookings,
    assignBooking,
    cancelBooking,
    currentUser,
    reassignBooking,
    updateBookingAttendance,
    updateBookingPayment,
    updateBookingRecovery,
  } = useBookingActions()

  const booking = bookings.find((entry) => entry.id === bookingId)

  if (!booking) {
    return (
      <section className="card detail-layout">
        <SectionHeader
          eyebrow="Reservation lookup"
          title="Booking not found"
          description="The reservation may have been removed from local state or the link is invalid."
        />
        <Link className="secondary-button inline-link" to="/app/bookings">
          Back to bookings
        </Link>
      </section>
    )
  }

  const canViewBooking =
    currentUser?.role !== 'guest' || currentUser.email === booking.guestEmail

  if (!canViewBooking) {
    return (
      <section className="card detail-layout">
        <SectionHeader
          eyebrow="Access restricted"
          title="This reservation is not visible to the current guest profile"
          description="Guests can only open their own bookings. Management, admin, and service roles can review all reservations."
        />
        <Link className="secondary-button inline-link" to="/app/bookings">
          Return to booking hub
        </Link>
      </section>
    )
  }

  const canOperate =
    currentUser?.role === 'waitress' ||
    currentUser?.role === 'management' ||
    currentUser?.role === 'admin'

  const canCancel =
    booking.status !== 'cancelled' &&
    (currentUser?.role === 'guest' || currentUser?.role === 'management' || currentUser?.role === 'admin')

  return (
    <div className="screen-stack">
      <section className="card detail-layout">
        <div>
          <SectionHeader
            eyebrow="Reservation detail"
            title={`${booking.id} for ${booking.guestName}`}
            description="This view collects the operational and commercial details for a single booking into one drill-down page."
          />
          <div className="detail-grid">
            <article className="detail-card">
              <span>Table</span>
              <strong>{booking.tableId}</strong>
              <p>{booking.area}</p>
            </article>
            <article className="detail-card">
              <span>Guests</span>
              <strong>{booking.guests}</strong>
              <p>Arrival {booking.time} · {booking.attendanceStatus}</p>
            </article>
            <article className="detail-card">
              <span>Deposit</span>
              <strong>{booking.depositAmount}</strong>
              <p>Payment: {booking.paymentStatus}</p>
            </article>
            <article className="detail-card">
              <span>Waitress</span>
              <strong>{booking.selectedWaitress}</strong>
              <p>Date: {booking.date} · Recovery: {booking.recoveryStatus}</p>
            </article>
          </div>
        </div>

        <aside className="summary-card accent">
          <span className="eyebrow subtle">Booking actions</span>
          <strong>{booking.status}</strong>
          <p>{booking.preOrderSummary}</p>
          <div className="action-meta">
            <span>{booking.guestEmail}</span>
            <span>{booking.date}</span>
            <span>{booking.paymentStatus}</span>
            <span>{booking.attendanceStatus}</span>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate('/app/bookings')}
            >
              Back
            </button>
            {canOperate ? (
              <>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => assignBooking(booking.id, booking.selectedWaitress)}
                >
                  Assign now
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => reassignBooking(booking.id)}
                >
                  Reassign
                </button>
              </>
            ) : null}
            {canCancel ? (
              <button
                type="button"
                className="secondary-button"
                onClick={() => cancelBooking(booking.id, `${currentUser?.name ?? 'User'} cancelled this reservation.`)}
              >
                Cancel booking
              </button>
            ) : null}
          </div>
          {canOperate ? (
            <div className="detail-action-stack">
              <span className="eyebrow subtle">Attendance controls</span>
              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => updateBookingAttendance(booking.id, 'arrived', 'Guest checked in at the entrance desk.')}
                >
                  Mark arrived
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => updateBookingAttendance(booking.id, 'late', 'Guest is delayed and table hold remains active.')}
                >
                  Mark late
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => updateBookingAttendance(booking.id, 'no-show', 'Guest did not arrive inside the hold window.')}
                >
                  Mark no-show
                </button>
              </div>
            </div>
          ) : null}
          {canOperate ? (
            <div className="detail-action-stack">
              <span className="eyebrow subtle">Payment controls</span>
              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => updateBookingPayment(booking.id, 'captured', 'Deposit capture confirmed by operations.')}
                >
                  Capture deposit
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => updateBookingPayment(booking.id, 'preauth-held', 'Pre-authorisation retained while booking remains active.')}
                >
                  Hold pre-auth
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => updateBookingPayment(booking.id, 'refund-pending', 'Refund requested and awaiting finance release.')}
                >
                  Start refund
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => updateBookingPayment(booking.id, 'refunded', 'Refund completed and customer has been notified.')}
                >
                  Mark refunded
                </button>
              </div>
            </div>
          ) : null}
          {currentUser?.role === 'management' || currentUser?.role === 'admin' ? (
            <div className="detail-action-stack">
              <span className="eyebrow subtle">Recovery controls</span>
              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => updateBookingRecovery(booking.id, 'monitoring', 'Recovery review opened for this reservation.')}
                >
                  Start review
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => updateBookingRecovery(booking.id, 'deposit-retained', 'Deposit retained under the venue no-show policy.')}
                >
                  Retain deposit
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => updateBookingRecovery(booking.id, 'recovered', 'Commercial loss recovered and case closed.')}
                >
                  Mark recovered
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => updateBookingRecovery(booking.id, 'waived', 'Management waived the penalty for this booking.')}
                >
                  Waive penalty
                </button>
              </div>
            </div>
          ) : null}
        </aside>
      </section>

      <section className="card">
        <SectionHeader
          eyebrow="Operational notes"
          title="What this reservation unlocks"
          description="Paid bookings can trigger waitress assignment, hostess requests, arrival prep, and management visibility depending on role and status."
        />
        <div className="checklist-grid">
          <article className="checklist-card">
            <strong>Guest identity</strong>
            <p>{booking.guestName} is tied to {booking.guestEmail} for verification and booking communications.</p>
          </article>
          <article className="checklist-card">
            <strong>Commercial lock-in</strong>
            <p>{booking.depositAmount} is currently marked as {booking.paymentStatus} for this reservation.</p>
          </article>
          <article className="checklist-card">
            <strong>Service readiness</strong>
            <p>Current waitress selection is {booking.selectedWaitress}, and service can be reassigned by staff roles.</p>
          </article>
          <article className="checklist-card">
            <strong>Arrival and recovery</strong>
            <p>Attendance is {booking.attendanceStatus} and recovery is {booking.recoveryStatus} for this reservation.</p>
          </article>
          <article className="checklist-card">
            <strong>Pre-order context</strong>
            <p>{booking.preOrderSummary}</p>
          </article>
        </div>
      </section>

      <section className="card">
        <SectionHeader
          eyebrow="Lifecycle history"
          title="Reservation audit trail"
          description="Every status change is now written back into the booking record so staff and guests can understand what happened and when."
        />
        <div className="history-list">
          {booking.history.map((entry) => (
            <article className="history-item" key={entry.id}>
              <div className="history-marker" />
              <div>
                <strong>{entry.title}</strong>
                <span>{entry.at}</span>
                <p>{entry.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}