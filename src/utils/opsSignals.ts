import type { BookingRecord, Tone } from '../types'

export type SignalBadge = {
  label: string
  tone: Tone
}

function parseTimestamp(value: string) {
  const parsed = new Date(value.replace(' ', 'T'))

  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed
}

export function formatRelativeAge(value: string) {
  const parsed = parseTimestamp(value)

  if (!parsed) {
    return 'Unknown age'
  }

  const diffMs = Math.max(Date.now() - parsed.getTime(), 0)
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 60) {
    return `${diffMinutes}m old`
  }

  const diffHours = Math.floor(diffMinutes / 60)

  if (diffHours < 24) {
    return `${diffHours}h old`
  }

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d old`
}

export function getBookingSignal(booking: BookingRecord): SignalBadge {
  if (booking.attendanceStatus === 'no-show' || booking.paymentStatus === 'refund-pending') {
    return { label: 'Immediate review', tone: 'urgent' }
  }

  if (booking.attendanceStatus === 'late' || booking.recoveryStatus === 'monitoring') {
    return { label: 'Watchlist', tone: 'accent' }
  }

  if (booking.recoveryStatus === 'deposit-retained' || booking.recoveryStatus === 'recovered') {
    return { label: 'Recovered', tone: 'positive' }
  }

  return { label: 'Stable', tone: 'default' }
}

export function getFeedSignal(source: string, title: string, detail: string): SignalBadge {
  const content = `${source} ${title} ${detail}`.toLowerCase()

  if (/no-show|refund|cancelled|banned/.test(content)) {
    return { label: 'Critical', tone: 'urgent' }
  }

  if (/late|monitoring|under-review|escalate/.test(content)) {
    return { label: 'Watch', tone: 'accent' }
  }

  if (/captured|arrived|recovered|approved|assigned/.test(content)) {
    return { label: 'Healthy', tone: 'positive' }
  }

  return { label: 'Normal', tone: 'default' }
}