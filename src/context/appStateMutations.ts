import type {
  BookingRecord,
  HostessProfile,
  ModerationCase,
  NotificationRecord,
} from '../types'

export function updateBookingById(
  bookings: BookingRecord[],
  bookingId: string,
  updater: (booking: BookingRecord) => BookingRecord,
) {
  return bookings.map((booking) =>
    booking.id === bookingId ? updater(booking) : booking,
  )
}

export function updateHostessProfileById(
  profiles: HostessProfile[],
  profileId: string,
  updater: (profile: HostessProfile) => HostessProfile,
) {
  return profiles.map((profile) =>
    profile.id === profileId ? updater(profile) : profile,
  )
}

export function updateModerationCaseById(
  moderationCases: ModerationCase[],
  caseId: string,
  updater: (moderationCase: ModerationCase) => ModerationCase,
) {
  return moderationCases.map((moderationCase) =>
    moderationCase.id === caseId ? updater(moderationCase) : moderationCase,
  )
}

export function prependNotifications(
  notifications: NotificationRecord[],
  ...nextNotifications: NotificationRecord[]
) {
  return [...nextNotifications, ...notifications]
}

export function markNotificationReadById(
  notifications: NotificationRecord[],
  notificationId: string,
) {
  return notifications.map((notification) =>
    notification.id === notificationId
      ? { ...notification, unread: false }
      : notification,
  )
}

export function markAllNotificationsRead(
  notifications: NotificationRecord[],
) {
  return notifications.map((notification) => ({ ...notification, unread: false }))
}