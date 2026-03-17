import { useMemo } from 'react'
import { useBookingActions } from './useBookingActions'

export function useServiceQueue() {
  const { assignBooking, bookings, reassignBooking } = useBookingActions()
  const activeQueue = useMemo(
    () =>
      bookings
        .filter(
          (booking) =>
            booking.status !== 'assigned' &&
            booking.status !== 'cancelled' &&
            booking.attendanceStatus !== 'no-show',
        )
        .slice(0, 6),
    [bookings],
  )

  function acceptBooking(bookingId: string, selectedWaitress: string) {
    assignBooking(bookingId, selectedWaitress)
  }

  return {
    activeQueue,
    acceptBooking,
    reassignBooking: (bookingId: string) => reassignBooking(bookingId),
  }
}