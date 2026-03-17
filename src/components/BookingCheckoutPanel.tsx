import { Link } from 'react-router-dom'
import type { Dispatch, FormEventHandler, SetStateAction } from 'react'
import { SectionHeader } from './SectionHeader'
import type { BookingRecord, BookingTable } from '../types'

const statusCopy = {
  available:
    'Available now. The guest can lock this table immediately and optionally add pre-orders or a preferred waitress.',
  reserved:
    'Reserved. Deposit has been captured and hostess requests are now available to the verified table holder.',
  hostess:
    'Hostess-active. A bottle-girl request is tied to this table and the session will be tracked if accepted.',
}

type BookingCheckoutPanelProps = {
  checkoutSteps: string[]
  selectedTable: BookingTable
  currentStep: number
  latestBooking: BookingRecord | null
  guestName: string
  setGuestName: Dispatch<SetStateAction<string>>
  guestEmail: string
  setGuestEmail: Dispatch<SetStateAction<string>>
  guestCount: string
  setGuestCount: Dispatch<SetStateAction<string>>
  bookingDate: string
  setBookingDate: Dispatch<SetStateAction<string>>
  bookingTime: string
  setBookingTime: Dispatch<SetStateAction<string>>
  selectedWaitress: string
  setSelectedWaitress: Dispatch<SetStateAction<string>>
  preOrderSummary: string
  setPreOrderSummary: Dispatch<SetStateAction<string>>
  handleSubmit: FormEventHandler<HTMLFormElement>
  goBack: () => void
}

export function BookingCheckoutPanel({
  checkoutSteps,
  selectedTable,
  currentStep,
  latestBooking,
  guestName,
  setGuestName,
  guestEmail,
  setGuestEmail,
  guestCount,
  setGuestCount,
  bookingDate,
  setBookingDate,
  bookingTime,
  setBookingTime,
  selectedWaitress,
  setSelectedWaitress,
  preOrderSummary,
  setPreOrderSummary,
  handleSubmit,
  goBack,
}: BookingCheckoutPanelProps) {
  return (
    <section className="card split-layout">
      <div>
        <SectionHeader
          eyebrow="Booking flow"
          title="Premium reservations designed for certainty"
          description="The guest flow captures value early, exposes the venue visually, and starts service operations the moment payment clears."
        />
        <div className="timeline-grid compact">
          {checkoutSteps.map((step, index) => (
            <article className="timeline-card" key={step}>
              <span className="timeline-step">{index + 1}</span>
              <div>
                <strong>{step}</strong>
                <p>
                  {step === 'Guest'
                    ? 'Capture table-holder identity and party size before locking inventory.'
                    : step === 'Experience'
                      ? 'Set arrival timing, preferred service support, and commercial add-ons.'
                      : 'Confirm the reservation details and deposit before creating the booking.'}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="stack-block">
        <div className="summary-card accent">
          <span className="eyebrow subtle">Mobile-first booking summary</span>
          <strong>{selectedTable.id}</strong>
          <p>{selectedTable.area}</p>
          <div className="summary-grid">
            <div>
              <span>Capacity</span>
              <strong>{selectedTable.capacity}</strong>
            </div>
            <div>
              <span>Booking fee</span>
              <strong>{selectedTable.fee}</strong>
            </div>
          </div>
          <p>{statusCopy[selectedTable.status]}</p>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <span className="eyebrow subtle">Create booking</span>
          <div className="stepper">
            {checkoutSteps.map((step, index) => (
              <div key={step} className={`step-pill ${index === currentStep ? 'active' : ''}`}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>

          {currentStep === 0 ? (
            <>
              <label>
                <span>Guest name</span>
                <input value={guestName} onChange={(event) => setGuestName(event.target.value)} />
              </label>
              <label>
                <span>Email</span>
                <input value={guestEmail} onChange={(event) => setGuestEmail(event.target.value)} />
              </label>
              <div className="form-grid">
                <label>
                  <span>Guests</span>
                  <input value={guestCount} onChange={(event) => setGuestCount(event.target.value)} />
                </label>
                <label>
                  <span>Date</span>
                  <input type="date" value={bookingDate} onChange={(event) => setBookingDate(event.target.value)} />
                </label>
              </div>
            </>
          ) : null}

          {currentStep === 1 ? (
            <>
              <div className="form-grid">
                <label>
                  <span>Arrival time</span>
                  <input type="time" value={bookingTime} onChange={(event) => setBookingTime(event.target.value)} />
                </label>
                <label>
                  <span>Preferred waitress</span>
                  <select value={selectedWaitress} onChange={(event) => setSelectedWaitress(event.target.value)}>
                    <option>Kayla M.</option>
                    <option>Rina N.</option>
                    <option>No preference</option>
                  </select>
                </label>
              </div>
              <label>
                <span>Pre-order summary</span>
                <textarea
                  rows={3}
                  value={preOrderSummary}
                  onChange={(event) => setPreOrderSummary(event.target.value)}
                />
              </label>
            </>
          ) : null}

          {currentStep === 2 ? (
            <div className="confirmation-card">
              <strong>Confirm reservation</strong>
              <p>
                {guestName} is securing {selectedTable.id} in {selectedTable.area} for {guestCount} guests on {bookingDate} at {bookingTime}.
              </p>
              <div className="summary-grid compact-grid">
                <div>
                  <span>Deposit</span>
                  <strong>{selectedTable.fee}</strong>
                </div>
                <div>
                  <span>Service</span>
                  <strong>{selectedWaitress}</strong>
                </div>
              </div>
            </div>
          ) : null}

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={goBack} disabled={currentStep === 0}>
              Back
            </button>
            <button type="submit" className="primary-button">
              {currentStep === checkoutSteps.length - 1 ? 'Confirm booking' : 'Continue'}
            </button>
          </div>
        </form>

        {latestBooking ? (
          <div className="success-banner tone-positive">
            <strong>{latestBooking.id} created</strong>
            <p>
              {latestBooking.tableId} is now reserved for {latestBooking.guestName}. The booking has been added to shared mock state.
            </p>
            <Link className="inline-link" to={`/app/bookings/${latestBooking.id}`}>
              View booking details
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}