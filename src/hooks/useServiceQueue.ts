import { useMemo } from 'react'
import { useBookingActions } from './useBookingActions'
import { useVenueManagementActions } from './useVenueManagementActions'

export function useServiceQueue() {
  const { assignBooking, bookings, reassignBooking } = useBookingActions()
  const { venueManagementSettings } = useVenueManagementActions()
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
    currentWaitressOffer: {
      title: venueManagementSettings.waitressOfferTitle,
      detail: venueManagementSettings.waitressOfferDetail,
      value: venueManagementSettings.waitressOfferValue,
    },
  }
}