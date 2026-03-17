import { useMemo } from 'react'
import { analyticsKpis } from '../data/platformData'
import { useBookingActions } from './useBookingActions'
import { useOperationsActions } from './useOperationsActions'
import type { Stat } from '../types'
import { buildOperationsFeed } from '../utils/operationsFeed'

export function useAnalyticsModel() {
  const { bookings } = useBookingActions()
  const { moderationCases, notifications } = useOperationsActions()

  const dynamicKpis = useMemo<Stat[]>(() => {
    const captured = bookings.filter((booking) => booking.paymentStatus === 'captured').length
    const noShows = bookings.filter((booking) => booking.attendanceStatus === 'no-show').length
    const recoveryOpen = bookings.filter(
      (booking) => booking.recoveryStatus === 'monitoring',
    ).length
    const recovered = bookings.filter(
      (booking) =>
        booking.recoveryStatus === 'deposit-retained' || booking.recoveryStatus === 'recovered',
    ).length

    return [
      {
        ...analyticsKpis[0],
        value: String(bookings.length),
        detail: 'Current locally persisted reservations across all visible commercial states.',
      },
      {
        ...analyticsKpis[1],
        value: String(captured),
        detail: 'Reservations with deposit capture fully secured.',
      },
      {
        label: 'No-show count',
        value: String(noShows),
        detail: 'Reservations flagged as no-show after the arrival hold window expired.',
        tone: noShows > 0 ? 'urgent' : 'positive',
      },
      {
        label: 'Recovery open',
        value: String(recoveryOpen),
        detail: 'Cases still under commercial review before the final penalty outcome is set.',
        tone: recoveryOpen > 0 ? 'accent' : 'positive',
      },
      {
        label: 'Recovery resolved',
        value: String(recovered),
        detail: 'Bookings where the venue retained the deposit or fully closed the recovery case.',
        tone: 'positive',
      },
    ]
  }, [bookings])

  const recentAuditEvents = useMemo(
    () => buildOperationsFeed(bookings, moderationCases, notifications).slice(0, 4),
    [bookings, moderationCases, notifications],
  )

  return {
    dynamicKpis,
    recentAuditEvents,
  }
}