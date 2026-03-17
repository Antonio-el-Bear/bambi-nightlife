import type {
  BookingRecord,
  HostessProfile,
  ModerationCase,
  NotificationRecord,
  VenueManagementSettings,
} from '../types'
import type { BookingInput } from './appStateTypes'
import { makeHistoryEntry, makeNotification } from './appStatePersistence'

type BookingStatus = BookingRecord['status']
type PaymentStatus = BookingRecord['paymentStatus']
type AttendanceStatus = BookingRecord['attendanceStatus']
type RecoveryStatus = BookingRecord['recoveryStatus']

type BookingMutationArtifacts = {
  historyEntry: BookingRecord['history'][number]
  notifications: NotificationRecord[]
}

export function buildBookingCreatedArtifacts(
  input: BookingInput,
  bookingId: string,
): BookingMutationArtifacts {
  return {
    historyEntry: makeHistoryEntry(
      'Booking created',
      `Reservation captured for ${input.tableId} with deposit ${input.depositAmount}.`,
    ),
    notifications: [
      makeNotification(
        'Booking submitted successfully',
        `${input.tableId} for ${input.date} at ${input.time} is now in the reservation pipeline.`,
        ['guest'],
        {
          userEmail: input.guestEmail,
          link: `/app/bookings/${bookingId}`,
          tone: 'positive',
          category: 'booking',
          actor: 'Platform',
        },
      ),
      makeNotification(
        'New reservation entered the system',
        `${input.guestName} secured ${input.tableId} with deposit ${input.depositAmount}.`,
        input.selectedWaitress === 'No preference'
          ? ['management', 'admin']
          : ['waitress', 'management', 'admin'],
        {
          link: `/app/bookings/${bookingId}`,
          tone: 'accent',
          category: 'booking',
          actor: 'Platform',
        },
      ),
    ],
  }
}

export function buildBookingStatusArtifacts(
  booking: BookingRecord,
  status: BookingStatus,
  selectedWaitress?: string,
): BookingMutationArtifacts {
  const assignedWaitress = selectedWaitress ?? booking.selectedWaitress

  return {
    historyEntry: makeHistoryEntry(
      status === 'assigned' ? 'Waitress assigned' : 'Booking updated',
      status === 'assigned'
        ? `${assignedWaitress} is now attached to this reservation.`
        : `Reservation status changed to ${status}.`,
    ),
    notifications: [
      makeNotification(
        status === 'assigned' ? 'Waitress assignment confirmed' : 'Booking status updated',
        status === 'assigned'
          ? `${assignedWaitress} is now attached to ${booking.id}.`
          : `${booking.id} changed to ${status}.`,
        ['guest'],
        {
          userEmail: booking.guestEmail,
          link: `/app/bookings/${booking.id}`,
          tone: status === 'assigned' ? 'positive' : 'accent',
          category: 'booking',
          actor: assignedWaitress,
        },
      ),
      makeNotification(
        `${booking.id} requires floor awareness`,
        status === 'assigned'
          ? `${assignedWaitress} accepted the reservation.`
          : `Reservation status changed to ${status} for ${booking.guestName}.`,
        ['waitress', 'management', 'admin'],
        {
          link: `/app/bookings/${booking.id}`,
          tone: status === 'assigned' ? 'accent' : 'default',
          category: 'booking',
          actor: assignedWaitress,
        },
      ),
    ],
  }
}

function paymentHistoryTitle(paymentStatus: PaymentStatus) {
  if (paymentStatus === 'captured') {
    return 'Deposit captured'
  }

  if (paymentStatus === 'preauth-held') {
    return 'Pre-authorisation held'
  }

  if (paymentStatus === 'refund-pending') {
    return 'Refund in progress'
  }

  return 'Refund completed'
}

function paymentNotificationTitle(paymentStatus: PaymentStatus) {
  if (paymentStatus === 'captured') {
    return 'Deposit secured'
  }

  if (paymentStatus === 'preauth-held') {
    return 'Pre-authorisation recorded'
  }

  if (paymentStatus === 'refund-pending') {
    return 'Refund initiated'
  }

  return 'Refund completed'
}

function paymentTone(paymentStatus: PaymentStatus): NotificationRecord['tone'] {
  if (paymentStatus === 'captured') {
    return 'positive'
  }

  if (paymentStatus === 'refund-pending' || paymentStatus === 'refunded') {
    return 'urgent'
  }

  return 'accent'
}

export function buildBookingPaymentArtifacts(
  booking: BookingRecord,
  paymentStatus: PaymentStatus,
  note?: string,
): BookingMutationArtifacts {
  const tone = paymentTone(paymentStatus)
  const detail = note ?? `${booking.id} payment state is now ${paymentStatus}.`

  return {
    historyEntry: makeHistoryEntry(
      paymentHistoryTitle(paymentStatus),
      note ?? `Payment state changed to ${paymentStatus}.`,
    ),
    notifications: [
      makeNotification(
        paymentNotificationTitle(paymentStatus),
        detail,
        ['guest'],
        {
          userEmail: booking.guestEmail,
          link: `/app/bookings/${booking.id}`,
          tone,
          category: 'payments',
          actor: 'Finance',
        },
      ),
      makeNotification(
        `${booking.id} payment updated`,
        note ?? `Commercial state moved to ${paymentStatus} for ${booking.guestName}.`,
        ['management', 'admin'],
        {
          link: `/app/bookings/${booking.id}`,
          tone,
          category: 'payments',
          actor: 'Finance',
        },
      ),
    ],
  }
}

function attendanceHistoryTitle(attendanceStatus: AttendanceStatus) {
  if (attendanceStatus === 'arrived') {
    return 'Guest arrived'
  }

  if (attendanceStatus === 'late') {
    return 'Arrival delayed'
  }

  if (attendanceStatus === 'no-show') {
    return 'No-show flagged'
  }

  return 'Arrival expected'
}

function guestAttendanceTitle(attendanceStatus: AttendanceStatus) {
  if (attendanceStatus === 'arrived') {
    return 'Your table has been checked in'
  }

  if (attendanceStatus === 'late') {
    return 'Your reservation is marked delayed'
  }

  if (attendanceStatus === 'no-show') {
    return 'Your reservation has been marked as a no-show'
  }

  return 'Reservation timing updated'
}

export function buildBookingAttendanceArtifacts(
  booking: BookingRecord,
  attendanceStatus: AttendanceStatus,
  note?: string,
): BookingMutationArtifacts {
  return {
    historyEntry: makeHistoryEntry(
      attendanceHistoryTitle(attendanceStatus),
      note ?? `Attendance state changed to ${attendanceStatus}.`,
    ),
    notifications: [
      makeNotification(
        attendanceStatus === 'no-show' ? 'No-show requires review' : 'Arrival state updated',
        note ?? `${booking.id} attendance is now ${attendanceStatus}.`,
        ['management', 'admin', 'waitress'],
        {
          link: `/app/bookings/${booking.id}`,
          tone: attendanceStatus === 'no-show' ? 'urgent' : 'accent',
          category: 'attendance',
          actor: 'Door team',
        },
      ),
      makeNotification(
        guestAttendanceTitle(attendanceStatus),
        note ?? `${booking.id} attendance is now ${attendanceStatus}.`,
        ['guest'],
        {
          userEmail: booking.guestEmail,
          link: `/app/bookings/${booking.id}`,
          tone: attendanceStatus === 'no-show' ? 'urgent' : 'default',
          category: 'attendance',
          actor: 'Door team',
        },
      ),
    ],
  }
}

function recoveryHistoryTitle(recoveryStatus: RecoveryStatus) {
  if (recoveryStatus === 'deposit-retained') {
    return 'Deposit retained'
  }

  if (recoveryStatus === 'recovered') {
    return 'Recovery completed'
  }

  if (recoveryStatus === 'waived') {
    return 'Penalty waived'
  }

  return 'Recovery review updated'
}

function recoveryManagementTone(recoveryStatus: RecoveryStatus): NotificationRecord['tone'] {
  if (recoveryStatus === 'deposit-retained' || recoveryStatus === 'recovered') {
    return 'positive'
  }

  if (recoveryStatus === 'waived') {
    return 'urgent'
  }

  return 'accent'
}

function recoveryGuestTitle(recoveryStatus: RecoveryStatus) {
  if (recoveryStatus === 'deposit-retained') {
    return 'Venue retained your deposit'
  }

  if (recoveryStatus === 'waived') {
    return 'Penalty waived on your reservation'
  }

  return 'Reservation recovery updated'
}

export function buildBookingRecoveryArtifacts(
  booking: BookingRecord,
  recoveryStatus: RecoveryStatus,
  note?: string,
): BookingMutationArtifacts {
  return {
    historyEntry: makeHistoryEntry(
      recoveryHistoryTitle(recoveryStatus),
      note ?? `Recovery state changed to ${recoveryStatus}.`,
    ),
    notifications: [
      makeNotification(
        `${booking.id} recovery updated`,
        note ?? `Recovery handling moved to ${recoveryStatus}.`,
        ['management', 'admin'],
        {
          link: `/app/bookings/${booking.id}`,
          tone: recoveryManagementTone(recoveryStatus),
          category: 'recovery',
          actor: 'Management',
        },
      ),
      makeNotification(
        recoveryGuestTitle(recoveryStatus),
        note ?? `${booking.id} recovery state is now ${recoveryStatus}.`,
        ['guest'],
        {
          userEmail: booking.guestEmail,
          link: `/app/bookings/${booking.id}`,
          tone: recoveryStatus === 'waived' ? 'positive' : 'default',
          category: 'recovery',
          actor: 'Management',
        },
      ),
    ],
  }
}

export function buildBookingCancellationArtifacts(
  booking: BookingRecord,
  actor: string,
  reason?: string,
): BookingMutationArtifacts {
  return {
    historyEntry: makeHistoryEntry(
      'Booking cancelled',
      reason ?? 'Reservation was cancelled from the current app session.',
    ),
    notifications: [
      makeNotification(
        'Booking cancelled',
        `${booking.id} has been cancelled. ${reason ?? 'Please review the reservation timeline for context.'}`,
        ['management', 'admin', 'waitress'],
        {
          link: `/app/bookings/${booking.id}`,
          tone: 'urgent',
          category: 'booking',
          actor,
        },
      ),
      makeNotification(
        'Your reservation was cancelled',
        reason ?? `${booking.id} was cancelled from the current app session.`,
        ['guest'],
        {
          userEmail: booking.guestEmail,
          link: `/app/bookings/${booking.id}`,
          tone: 'urgent',
          category: 'booking',
          actor,
        },
      ),
    ],
  }
}

export function buildHostessApprovalNotification(
  profileId: string,
  approvalStatus: HostessProfile['approvalStatus'],
) {
  return makeNotification(
    'Female guest status changed',
    `${profileId} is now marked as ${approvalStatus}.`,
    ['hostess', 'management', 'admin'],
    {
      link: '/app/hostess',
      tone: approvalStatus === 'approved' ? 'positive' : 'accent',
      category: 'system',
      actor: 'Management',
    },
  )
}

export function buildBottleRequestNotification(
  profileId: string,
  bottleRequestStatus: HostessProfile['bottleRequestStatus'],
) {
  return makeNotification(
    'Bottle request updated',
    `${profileId} changed to ${bottleRequestStatus} inside the hostess workflow.`,
    ['hostess', 'management', 'admin'],
    {
      link: '/app/hostess',
      tone: bottleRequestStatus === 'accepted' ? 'positive' : 'default',
      category: 'system',
      actor: 'Hostess desk',
    },
  )
}

export function buildModerationCaseNotification(
  caseId: string,
  state: ModerationCase['state'],
  confirmationCount?: number,
) {
  return makeNotification(
    'Moderation status changed',
    `${caseId} moved to ${state}${confirmationCount ? ` with ${confirmationCount} confirmations.` : '.'}`,
    ['management', 'admin'],
    {
      link: '/app/operations',
      tone: state === 'banned' ? 'urgent' : 'accent',
      category: 'moderation',
      actor: state === 'banned' ? 'Management' : 'Security',
    },
  )
}

export function buildOperatorNotification(
  title: string,
  detail: string,
  tone: NotificationRecord['tone'] = 'accent',
  link?: string,
  category: NotificationRecord['category'] = 'system',
  actor?: string,
) {
  return makeNotification(title, detail, ['waitress', 'management', 'admin'], {
    link,
    tone,
    category,
    actor,
  })
}

export function buildVenueManagementNotifications(
  previous: VenueManagementSettings,
  next: VenueManagementSettings,
  actor: string,
) {
  const notifications: NotificationRecord[] = []
  const promotionChanged =
    previous.featuredEventTitle !== next.featuredEventTitle ||
    previous.featuredEventSummary !== next.featuredEventSummary ||
    previous.featuredEventPosterUrl !== next.featuredEventPosterUrl ||
    previous.featuredEventDate !== next.featuredEventDate ||
    previous.featuredEventStatus !== next.featuredEventStatus ||
    previous.featuredEventAudience !== next.featuredEventAudience
  const offerChanged =
    previous.waitressOfferTitle !== next.waitressOfferTitle ||
    previous.waitressOfferDetail !== next.waitressOfferDetail ||
    previous.waitressOfferValue !== next.waitressOfferValue

  if (promotionChanged) {
    notifications.push(
      makeNotification(
        'Venue event campaign updated',
        `${next.featuredEventTitle} is now ${next.featuredEventStatus} for ${next.featuredEventDate}.`,
        ['management', 'admin'],
        {
          link: '/app',
          tone: next.featuredEventStatus === 'live' ? 'positive' : 'accent',
          category: 'system',
          actor,
        },
      ),
    )

    if (next.featuredEventStatus === 'live') {
      notifications.push(
        makeNotification(
          'New promoted event is now live',
          `${next.featuredEventTitle} is being pushed across the venue: ${next.featuredEventSummary}`,
          ['guest', 'hostess', 'waitress'],
          {
            link: '/app',
            tone: 'accent',
            category: 'system',
            actor,
          },
        ),
      )
    }
  }

  if (offerChanged) {
    notifications.push(
      makeNotification(
        'Waitress offer updated',
        `${next.waitressOfferTitle} now offers ${next.waitressOfferValue}.`,
        ['waitress', 'management', 'admin'],
        {
          link: '/app/service',
          tone: 'positive',
          category: 'system',
          actor,
        },
      ),
    )
  }

  return notifications
}