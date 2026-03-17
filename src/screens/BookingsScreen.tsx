import { useMemo, useState } from 'react'
import { BookingCheckoutPanel } from '../components/BookingCheckoutPanel'
import { BookingExperiencePanel } from '../components/BookingExperiencePanel'
import { BookingsTriagePanel } from '../components/BookingsTriagePanel'
import { RecentBookingsPanel } from '../components/RecentBookingsPanel'
import { ScreenBanner } from '../components/ScreenBanner'
import { bookingTables } from '../data/platformData'
import { useBookingActions } from '../hooks/useBookingActions'
import { useBookingCheckoutFlow } from '../hooks/useBookingCheckoutFlow'
import { useBookingsTriageView } from '../hooks/useBookingsTriageView'

export function BookingsScreen() {
  const checkoutSteps = ['Guest', 'Experience', 'Confirm']
  const { bookings, currentUser } = useBookingActions()
  const [selectedTableId, setSelectedTableId] = useState(bookingTables[0].id)

  const {
    statusFilter,
    setStatusFilter,
    paymentFilter,
    setPaymentFilter,
    attendanceFilter,
    setAttendanceFilter,
    recoveryFilter,
    setRecoveryFilter,
    bookingSearch,
    setBookingSearch,
    savedViewAvailable,
    filteredBookings,
    riskCounts,
    visibleSelectedIds,
    visibleSelectedBookings,
    allVisibleSelected,
    canManageBookings,
    canRunCommercialBulkActions,
    canRunArrivalBulkActions,
    applyPreset,
    saveView,
    loadView,
    clearView,
    toggleBookingSelection,
    toggleSelectAllVisible,
    clearVisibleSelection,
    runBulkAction,
  } = useBookingsTriageView()

  const selectedTable = useMemo(
    () => bookingTables.find((table) => table.id === selectedTableId) ?? bookingTables[0],
    [selectedTableId],
  )

  const {
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
  } = useBookingCheckoutFlow({ selectedTable, totalSteps: checkoutSteps.length })

  const recentBookings = bookings.slice(0, 3)

  return (
    <div className="screen-stack">
      <ScreenBanner
        chips={['VIP tables', 'Pre-orders', 'Fast checkout']}
        detail="Move from table choice to secured booking without losing the event energy."
        eyebrow="Bookings"
        imageAlt="Nightclub table service"
        imageUrl="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80"
        module="bookings"
        title="Book the night in a more visual way"
      />

      <BookingCheckoutPanel
        checkoutSteps={checkoutSteps}
        selectedTable={selectedTable}
        currentStep={currentStep}
        latestBooking={latestBooking}
        guestName={guestName}
        setGuestName={setGuestName}
        guestEmail={guestEmail}
        setGuestEmail={setGuestEmail}
        guestCount={guestCount}
        setGuestCount={setGuestCount}
        bookingDate={bookingDate}
        setBookingDate={setBookingDate}
        bookingTime={bookingTime}
        setBookingTime={setBookingTime}
        selectedWaitress={selectedWaitress}
        setSelectedWaitress={setSelectedWaitress}
        preOrderSummary={preOrderSummary}
        setPreOrderSummary={setPreOrderSummary}
        handleSubmit={handleSubmit}
        goBack={goBack}
      />

      <BookingExperiencePanel selectedTableId={selectedTableId} onSelectTable={setSelectedTableId} />

      <RecentBookingsPanel bookings={recentBookings} />

      {canManageBookings ? (
        <BookingsTriagePanel
          currentUserEmail={currentUser?.email}
          savedViewAvailable={savedViewAvailable}
          visibleSelectedIds={visibleSelectedIds}
          visibleSelectedBookings={visibleSelectedBookings}
          filteredBookings={filteredBookings}
          allVisibleSelected={allVisibleSelected}
          bookingSearch={bookingSearch}
          statusFilter={statusFilter}
          paymentFilter={paymentFilter}
          attendanceFilter={attendanceFilter}
          recoveryFilter={recoveryFilter}
          canRunCommercialBulkActions={canRunCommercialBulkActions}
          canRunArrivalBulkActions={canRunArrivalBulkActions}
          riskCounts={riskCounts}
          setBookingSearch={setBookingSearch}
          setStatusFilter={setStatusFilter}
          setPaymentFilter={setPaymentFilter}
          setAttendanceFilter={setAttendanceFilter}
          setRecoveryFilter={setRecoveryFilter}
          applyPreset={applyPreset}
          saveView={saveView}
          loadView={loadView}
          clearView={clearView}
          runBulkAction={runBulkAction}
          clearVisibleSelection={clearVisibleSelection}
          toggleSelectAllVisible={toggleSelectAllVisible}
          toggleBookingSelection={toggleBookingSelection}
        />
      ) : null}
    </div>
  )
}
