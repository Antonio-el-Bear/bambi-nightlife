import { Link } from 'react-router-dom'
import { SectionHeader } from './SectionHeader'
import type { BookingRecord } from '../types'
import { downloadCsv } from '../utils/csv'
import { formatRelativeAge, getBookingSignal } from '../utils/opsSignals'

type BookingsTriagePanelProps = {
  currentUserEmail?: string
  savedViewAvailable: boolean
  visibleSelectedIds: string[]
  visibleSelectedBookings: BookingRecord[]
  filteredBookings: BookingRecord[]
  allVisibleSelected: boolean
  bookingSearch: string
  statusFilter: 'all' | BookingRecord['status']
  paymentFilter: 'all' | BookingRecord['paymentStatus']
  attendanceFilter: 'all' | BookingRecord['attendanceStatus']
  recoveryFilter: 'all' | BookingRecord['recoveryStatus']
  canRunCommercialBulkActions: boolean
  canRunArrivalBulkActions: boolean
  riskCounts: {
    noShows: number
    openRecovery: number
    refundExposure: number
  }
  setBookingSearch: (value: string) => void
  setStatusFilter: (value: 'all' | BookingRecord['status']) => void
  setPaymentFilter: (value: 'all' | BookingRecord['paymentStatus']) => void
  setAttendanceFilter: (value: 'all' | BookingRecord['attendanceStatus']) => void
  setRecoveryFilter: (value: 'all' | BookingRecord['recoveryStatus']) => void
  applyPreset: (preset: 'reset' | 'no-show' | 'refund' | 'resolved') => void
  saveView: () => void
  loadView: () => void
  clearView: () => void
  runBulkAction: (action: 'mark-arrived' | 'start-recovery' | 'mark-recovered' | 'queue-refund') => void
  clearVisibleSelection: () => void
  toggleSelectAllVisible: () => void
  toggleBookingSelection: (bookingId: string) => void
}

export function BookingsTriagePanel({
  currentUserEmail,
  savedViewAvailable,
  visibleSelectedIds,
  visibleSelectedBookings,
  filteredBookings,
  allVisibleSelected,
  bookingSearch,
  statusFilter,
  paymentFilter,
  attendanceFilter,
  recoveryFilter,
  canRunCommercialBulkActions,
  canRunArrivalBulkActions,
  riskCounts,
  setBookingSearch,
  setStatusFilter,
  setPaymentFilter,
  setAttendanceFilter,
  setRecoveryFilter,
  applyPreset,
  saveView,
  loadView,
  clearView,
  runBulkAction,
  clearVisibleSelection,
  toggleSelectAllVisible,
  toggleBookingSelection,
}: BookingsTriagePanelProps) {
  return (
    <section className="card">
      <SectionHeader
        eyebrow="Operator triage"
        title="Filter bookings by commercial and attendance risk"
        description="Management and floor teams can isolate no-shows, refund exposure, and recovery cases without opening each reservation individually."
      />
      <div className="form-actions export-actions">
        <button type="button" className="secondary-button" onClick={() => applyPreset('no-show')}>
          No-show review
        </button>
        <button type="button" className="secondary-button" onClick={() => applyPreset('refund')}>
          Refund queue
        </button>
        <button type="button" className="secondary-button" onClick={() => applyPreset('resolved')}>
          Recovery closed
        </button>
        <button type="button" className="secondary-button" onClick={() => applyPreset('reset')}>
          Reset filters
        </button>
        <button type="button" className="secondary-button" onClick={saveView}>
          Save current view
        </button>
        <button type="button" className="secondary-button" onClick={loadView}>
          Load saved view
        </button>
        <button type="button" className="secondary-button" onClick={clearView}>
          Clear saved view
        </button>
        <button
          type="button"
          className="secondary-button"
          disabled={visibleSelectedIds.length === 0}
          onClick={() =>
            downloadCsv(
              'bambi-bookings-selected.csv',
              ['Booking ID', 'Guest', 'Table', 'Date', 'Time', 'Status', 'Payment', 'Attendance', 'Recovery', 'Deposit'],
              visibleSelectedBookings.map((booking) => [
                booking.id,
                booking.guestName,
                booking.tableId,
                booking.date,
                booking.time,
                booking.status,
                booking.paymentStatus,
                booking.attendanceStatus,
                booking.recoveryStatus,
                booking.depositAmount,
              ]),
            )
          }
        >
          Export selected CSV
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            downloadCsv(
              'bambi-bookings-triage.csv',
              ['Booking ID', 'Guest', 'Table', 'Date', 'Time', 'Status', 'Payment', 'Attendance', 'Recovery', 'Deposit'],
              filteredBookings.map((booking) => [
                booking.id,
                booking.guestName,
                booking.tableId,
                booking.date,
                booking.time,
                booking.status,
                booking.paymentStatus,
                booking.attendanceStatus,
                booking.recoveryStatus,
                booking.depositAmount,
              ]),
            )
          }
        >
          Export filtered CSV
        </button>
      </div>
      <div className="action-meta compact-meta preset-meta">
        <span>{savedViewAvailable ? 'Saved view available' : 'No saved view stored'}</span>
        <span>{currentUserEmail ?? 'staff profile'}</span>
        <span>{visibleSelectedIds.length} selected</span>
        <span>
          {canRunCommercialBulkActions
            ? 'Commercial actions enabled'
            : canRunArrivalBulkActions
              ? 'Arrival actions only'
              : 'Read-only'}
        </span>
      </div>
      <div className="form-actions bulk-actions">
        <button
          type="button"
          className="secondary-button"
          disabled={visibleSelectedIds.length === 0 || !canRunArrivalBulkActions}
          onClick={() => runBulkAction('mark-arrived')}
        >
          Mark arrived
        </button>
        <button
          type="button"
          className="secondary-button"
          disabled={visibleSelectedIds.length === 0 || !canRunCommercialBulkActions}
          onClick={() => runBulkAction('start-recovery')}
        >
          Start recovery
        </button>
        <button
          type="button"
          className="secondary-button"
          disabled={visibleSelectedIds.length === 0 || !canRunCommercialBulkActions}
          onClick={() => runBulkAction('mark-recovered')}
        >
          Mark recovered
        </button>
        <button
          type="button"
          className="secondary-button"
          disabled={visibleSelectedIds.length === 0 || !canRunCommercialBulkActions}
          onClick={() => runBulkAction('queue-refund')}
        >
          Queue refund
        </button>
        <button
          type="button"
          className="secondary-button"
          disabled={visibleSelectedIds.length === 0}
          onClick={clearVisibleSelection}
        >
          Clear selection
        </button>
      </div>
      <div className="summary-grid compact-grid">
        <div className="summary-chip">
          <span>No-show exposure</span>
          <strong>{riskCounts.noShows}</strong>
        </div>
        <div className="summary-chip">
          <span>Recovery open</span>
          <strong>{riskCounts.openRecovery}</strong>
        </div>
        <div className="summary-chip">
          <span>Refund pending</span>
          <strong>{riskCounts.refundExposure}</strong>
        </div>
      </div>
      <div className="filter-toolbar">
        <label>
          <span>Search</span>
          <input
            value={bookingSearch}
            onChange={(event) => setBookingSearch(event.target.value)}
            placeholder="Search booking, guest, or table"
          />
        </label>
        <label>
          <span>Status</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | BookingRecord['status'])}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="assigned">Assigned</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label>
          <span>Payment</span>
          <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value as 'all' | BookingRecord['paymentStatus'])}>
            <option value="all">All</option>
            <option value="captured">Captured</option>
            <option value="preauth-held">Pre-auth held</option>
            <option value="refund-pending">Refund pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </label>
        <label>
          <span>Attendance</span>
          <select value={attendanceFilter} onChange={(event) => setAttendanceFilter(event.target.value as 'all' | BookingRecord['attendanceStatus'])}>
            <option value="all">All</option>
            <option value="expected">Expected</option>
            <option value="arrived">Arrived</option>
            <option value="late">Late</option>
            <option value="no-show">No-show</option>
          </select>
        </label>
        <label>
          <span>Recovery</span>
          <select value={recoveryFilter} onChange={(event) => setRecoveryFilter(event.target.value as 'all' | BookingRecord['recoveryStatus'])}>
            <option value="all">All</option>
            <option value="none">None</option>
            <option value="monitoring">Monitoring</option>
            <option value="deposit-retained">Deposit retained</option>
            <option value="recovered">Recovered</option>
            <option value="waived">Waived</option>
          </select>
        </label>
      </div>
      <div className="booking-table-shell">
        <div className="booking-table-head booking-table-row">
          <span>
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={toggleSelectAllVisible}
              aria-label="Select all visible bookings"
            />
          </span>
          <span>Booking</span>
          <span>Guest</span>
          <span>Status</span>
          <span>Payment</span>
          <span>Attendance</span>
          <span>Recovery</span>
          <span>SLA</span>
          <span>Action</span>
        </div>
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => {
            const signal = getBookingSignal(booking)
            const latestEvent = booking.history[0]?.at ?? `${booking.date} ${booking.time}`

            return (
              <article className="booking-table-row" key={booking.id}>
                <span>
                  <input
                    type="checkbox"
                    checked={visibleSelectedIds.includes(booking.id)}
                    onChange={() => toggleBookingSelection(booking.id)}
                    aria-label={`Select ${booking.id}`}
                  />
                </span>
                <div>
                  <strong>{booking.id}</strong>
                  <span>{booking.tableId}</span>
                </div>
                <div>
                  <strong>{booking.guestName}</strong>
                  <span>{booking.date} at {booking.time}</span>
                  <span>{formatRelativeAge(latestEvent)}</span>
                </div>
                <span>{booking.status}</span>
                <span>{booking.paymentStatus}</span>
                <span>{booking.attendanceStatus}</span>
                <span>{booking.recoveryStatus}</span>
                <span className={`signal-badge tone-${signal.tone}`}>{signal.label}</span>
                <Link className="inline-link table-link" to={`/app/bookings/${booking.id}`}>
                  Open
                </Link>
              </article>
            )
          })
        ) : (
          <div className="booking-table-empty">No bookings match the current filter set.</div>
        )}
      </div>
    </section>
  )
}