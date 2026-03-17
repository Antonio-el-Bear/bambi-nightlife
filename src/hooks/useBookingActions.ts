import { useAppState } from './useAppState'

export function useBookingActions() {
  const {
    bookings,
    cancelBooking,
    createBooking,
    createOperatorNotification,
    currentUser,
    updateBookingAttendance,
    updateBookingPayment,
    updateBookingRecovery,
    updateBookingStatus,
  } = useAppState()

  function assignBooking(bookingId: string, selectedWaitress: string) {
    updateBookingStatus(
      bookingId,
      'assigned',
      selectedWaitress === 'No preference' ? 'Kayla M.' : selectedWaitress,
    )
  }

  function reassignBooking(bookingId: string, selectedWaitress = 'Rina N.') {
    updateBookingStatus(bookingId, 'confirmed', selectedWaitress)
  }

  return {
    bookings,
    cancelBooking,
    createBooking,
    createOperatorNotification,
    currentUser,
    updateBookingAttendance,
    updateBookingPayment,
    updateBookingRecovery,
    updateBookingStatus,
    assignBooking,
    reassignBooking,
  }
}