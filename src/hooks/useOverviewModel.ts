import { useMemo } from 'react'
import { overviewStats } from '../data/platformData'
import { useAppState } from './useAppState'
import { useBookingActions } from './useBookingActions'
import { useAuth } from './useAuth'
import { useOperationsActions } from './useOperationsActions'
import { useVenueManagementActions } from './useVenueManagementActions'
import { buildOperationsFeed } from '../utils/operationsFeed'

export function useOverviewModel() {
  const { bookings, currentUser } = useBookingActions()
  const { updateCurrentUserProfile } = useAuth()
  const { attendancePosts, createAttendancePost } = useAppState()
  const { moderationCases, notifications } = useOperationsActions()
  const { updateVenueManagementSettings, venueManagementSettings } = useVenueManagementActions()

  const visibleBookings = useMemo(() => {
    if (!currentUser) {
      return bookings
    }

    if (currentUser.role === 'guest') {
      return bookings.filter((booking) => booking.guestEmail === currentUser.email)
    }

    return bookings
  }, [bookings, currentUser])

  const dynamicStats = useMemo(() => {
    const pendingCount = bookings.filter((booking) => booking.status === 'pending').length
    const visibleCount = visibleBookings.length
    const noShowCount = bookings.filter((booking) => booking.attendanceStatus === 'no-show').length

    return [
      overviewStats[0],
      {
        label: currentUser?.role === 'guest' ? 'My bookings' : 'Visible bookings',
        value: String(visibleCount),
        detail:
          currentUser?.role === 'guest'
            ? 'Reservations associated with the active guest profile.'
            : 'Reservations currently visible in this role context.',
        tone: 'accent' as const,
      },
      {
        label: 'Pending actions',
        value: String(pendingCount),
        detail: 'Reservations still waiting on assignment or response.',
        tone: pendingCount > 0 ? ('urgent' as const) : ('positive' as const),
      },
      {
        label: 'No-show exposure',
        value: String(noShowCount),
        detail: 'Reservations flagged as no-show and needing commercial recovery review.',
        tone: noShowCount > 0 ? ('urgent' as const) : ('positive' as const),
      },
    ]
  }, [bookings, currentUser, visibleBookings])

  const visibleNotifications = useMemo(
    () =>
      notifications.filter((notification) => {
        const roleMatches = notification.roleTargets.includes(currentUser?.role ?? 'guest')
        const userMatches = !notification.userEmail || notification.userEmail === currentUser?.email

        return roleMatches && userMatches
      }),
    [currentUser, notifications],
  )

  const operationsHighlights = useMemo(
    () => buildOperationsFeed(bookings, moderationCases, notifications).slice(0, 3),
    [bookings, moderationCases, notifications],
  )

  const visibleAttendancePosts = useMemo(
    () => attendancePosts.slice(0, 6),
    [attendancePosts],
  )

  const tonightSignals = useMemo(() => {
    const pendingCount = bookings.filter((booking) => booking.status === 'pending').length
    const noShowCount = bookings.filter((booking) => booking.attendanceStatus === 'no-show').length
    const unreadCount = visibleNotifications.filter((notification) => notification.unread).length

    return [
      {
        id: 'bookings' as const,
        label: currentUser?.role === 'guest' ? 'My tables' : 'Active bookings',
        value: String(visibleBookings.length),
        detail: currentUser?.role === 'guest' ? 'Reservations locked under your profile.' : 'Visible live reservations right now.',
      },
      {
        id: 'buzz' as const,
        label: 'Social buzz',
        value: String(visibleAttendancePosts.length),
        detail: 'Attendance posts feeding the night’s social momentum.',
      },
      {
        id: 'service' as const,
        label: 'Service pressure',
        value: String(pendingCount),
        detail: pendingCount > 0 ? 'Requests still waiting on response or assignment.' : 'No queue pressure showing right now.',
      },
      {
        id: 'ops' as const,
        label: 'Ops watch',
        value: String(Math.max(noShowCount, unreadCount)),
        detail: noShowCount > 0 ? 'No-show or recovery risk needs attention.' : `${unreadCount} unread alerts still open.`,
      },
    ]
  }, [bookings, currentUser?.role, visibleAttendancePosts.length, visibleBookings.length, visibleNotifications])

  return {
    currentUser,
    visibleBookings,
    visibleAttendancePosts,
    tonightSignals,
    dynamicStats,
    visibleNotifications,
    operationsHighlights,
    venueManagementSettings,
    updateVenueManagementSettings,
    updateCurrentUserProfile,
    createAttendancePost,
    canCreateAttendancePosts:
      currentUser?.role === 'guest' || currentUser?.role === 'hostess' || currentUser?.role === 'waitress',
    canManageVenueSettings:
      currentUser?.role === 'management' || currentUser?.role === 'admin',
  }
}