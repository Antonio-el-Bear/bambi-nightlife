import type {
  AuthUser,
  BookingHistoryEntry,
  BookingRecord,
  HostessProfile,
  ModerationCase,
  NotificationRecord,
} from '../types'
import {
  seededBookings,
  seededHostessProfiles,
  seededModerationCases,
  seededNotifications,
} from './appStateData'

const SESSION_KEY = 'bambi-platform-session'
const BOOKINGS_KEY = 'bambi-platform-bookings'
const HOSTESS_KEY = 'bambi-platform-hostess'
const MODERATION_KEY = 'bambi-platform-moderation'
const NOTIFICATIONS_KEY = 'bambi-platform-notifications'

function hasWindow() {
  return typeof window !== 'undefined'
}

function readStorage<T>(key: string): T | null {
  if (!hasWindow()) {
    return null
  }

  const value = window.localStorage.getItem(key)

  if (!value) {
    return null
  }

  return JSON.parse(value) as T
}

function writeStorage<T>(key: string, value: T) {
  if (!hasWindow()) {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

function removeStorage(key: string) {
  if (!hasWindow()) {
    return
  }

  window.localStorage.removeItem(key)
}

export function formatEventTime() {
  return new Date().toLocaleString('en-ZA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function makeHistoryEntry(title: string, detail: string): BookingHistoryEntry {
  return {
    id: `EV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    at: formatEventTime(),
    title,
    detail,
  }
}

export function makeBookingId(existingCount: number) {
  return `BK-${2400 + existingCount + 1}`
}

export function makeNotification(
  title: string,
  detail: string,
  roleTargets: NotificationRecord['roleTargets'],
  options?: Pick<NotificationRecord, 'userEmail' | 'link' | 'tone' | 'category' | 'actor'>,
): NotificationRecord {
  return {
    id: `NT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    detail,
    createdAt: formatEventTime(),
    unread: true,
    tone: options?.tone ?? 'default',
    roleTargets,
    category: options?.category ?? 'system',
    actor: options?.actor,
    userEmail: options?.userEmail,
    link: options?.link,
  }
}

export function normalizeBookings(entries: BookingRecord[]) {
  return entries.map((entry) => ({
    ...entry,
    paymentStatus: entry.paymentStatus ?? 'captured',
    attendanceStatus: entry.attendanceStatus ?? 'expected',
    recoveryStatus: entry.recoveryStatus ?? 'none',
    history:
      entry.history && entry.history.length > 0
        ? entry.history
        : [
            makeHistoryEntry(
              'Booking imported',
              'Legacy reservation was normalized into the current booking lifecycle model.',
            ),
          ],
  }))
}

export function loadSession() {
  return readStorage<AuthUser>(SESSION_KEY)
}

export function persistSession(session: AuthUser | null) {
  if (session) {
    writeStorage(SESSION_KEY, session)
    return
  }

  removeStorage(SESSION_KEY)
}

export function loadBookings() {
  const saved = readStorage<BookingRecord[]>(BOOKINGS_KEY)
  return normalizeBookings(saved ?? seededBookings)
}

export function persistBookings(bookings: BookingRecord[]) {
  writeStorage(BOOKINGS_KEY, bookings)
}

export function loadHostessProfiles() {
  return readStorage<HostessProfile[]>(HOSTESS_KEY) ?? seededHostessProfiles
}

export function persistHostessProfiles(hostessProfiles: HostessProfile[]) {
  writeStorage(HOSTESS_KEY, hostessProfiles)
}

export function loadModerationCases() {
  return readStorage<ModerationCase[]>(MODERATION_KEY) ?? seededModerationCases
}

export function persistModerationCases(moderationCases: ModerationCase[]) {
  writeStorage(MODERATION_KEY, moderationCases)
}

export function loadNotifications() {
  return readStorage<NotificationRecord[]>(NOTIFICATIONS_KEY) ?? seededNotifications
}

export function persistNotifications(notifications: NotificationRecord[]) {
  writeStorage(NOTIFICATIONS_KEY, notifications)
}