import type { BookingRecord, ModerationCase, NotificationRecord } from '../types'

export type OperationsFeedEntry = {
  id: string
  at: string
  title: string
  detail: string
  source: 'Booking' | 'Moderation' | 'Notification'
  category: NotificationRecord['category']
  actor?: string
}

function inferBookingCategory(title: string, detail: string): NotificationRecord['category'] {
  const content = `${title} ${detail}`.toLowerCase()

  if (/deposit|pre-authorisation|refund|payment/.test(content)) {
    return 'payments'
  }

  if (/arrived|arrival|late|no-show/.test(content)) {
    return 'attendance'
  }

  if (/recover|retained|waived/.test(content)) {
    return 'recovery'
  }

  return 'booking'
}

export function buildOperationsFeed(
  bookings: BookingRecord[],
  moderationCases: ModerationCase[],
  notifications: NotificationRecord[],
) {
  const bookingEvents: OperationsFeedEntry[] = bookings.flatMap((booking) =>
    booking.history.map((entry) => ({
      id: `${booking.id}-${entry.id}`,
      at: entry.at,
      title: entry.title,
      detail: `${booking.id} · ${booking.guestName} · ${entry.detail}`,
      source: 'Booking',
      category: inferBookingCategory(entry.title, entry.detail),
      actor: booking.selectedWaitress === 'Pending' ? 'Platform' : booking.selectedWaitress,
    })),
  )

  const moderationEvents: OperationsFeedEntry[] = moderationCases.map((item) => ({
    id: item.id,
    at: `2026-03-17 ${String(18 + item.confirmationCount).padStart(2, '0')}:10`,
    title: `${item.profileName} moderation ${item.state}`,
    detail: `${item.reason} Confirmations: ${item.confirmationCount}.`,
    source: 'Moderation',
    category: 'moderation',
    actor: item.confirmationCount >= 2 ? 'Management' : 'Security',
  }))

  const notificationEvents: OperationsFeedEntry[] = notifications.map((notification) => ({
    id: notification.id,
    at: notification.createdAt,
    title: notification.title,
    detail: notification.detail,
    source: 'Notification',
    category: notification.category,
    actor: notification.actor,
  }))

  return [...bookingEvents, ...moderationEvents, ...notificationEvents].sort((left, right) =>
    right.at.localeCompare(left.at),
  )
}