import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  AuthUser,
  BookingRecord,
  HostessProfile,
  ModerationCase,
  NotificationRecord,
} from '../types'
import { loginOptions, seededBookings } from './appStateData'
import {
  buildBookingAttendanceArtifacts,
  buildBookingCancellationArtifacts,
  buildBookingCreatedArtifacts,
  buildBookingPaymentArtifacts,
  buildBookingRecoveryArtifacts,
  buildBookingStatusArtifacts,
  buildBottleRequestNotification,
  buildHostessApprovalNotification,
  buildModerationCaseNotification,
  buildOperatorNotification,
} from './appStateEvents'
import {
  loadBookings,
  loadHostessProfiles,
  loadModerationCases,
  loadNotifications,
  loadSession,
  makeBookingId,
  persistBookings,
  persistHostessProfiles,
  persistModerationCases,
  persistNotifications,
  persistSession,
} from './appStatePersistence'
import {
  markAllNotificationsRead,
  markNotificationReadById,
  prependNotifications,
  updateBookingById,
  updateHostessProfileById,
  updateModerationCaseById,
} from './appStateMutations'
import { AppStateContext, type AppStateValue, type BookingInput } from './appStateTypes'

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => loadSession())
  const [bookings, setBookings] = useState<BookingRecord[]>(() => loadBookings())
  const [hostessProfiles, setHostessProfiles] = useState<HostessProfile[]>(() => loadHostessProfiles())
  const [moderationCases, setModerationCases] = useState<ModerationCase[]>(() => loadModerationCases())
  const [notifications, setNotifications] = useState<NotificationRecord[]>(() => loadNotifications())

  useEffect(() => {
    persistSession(currentUser)
  }, [currentUser])

  useEffect(() => {
    persistBookings(bookings)
  }, [bookings])

  useEffect(() => {
    persistHostessProfiles(hostessProfiles)
  }, [hostessProfiles])

  useEffect(() => {
    persistModerationCases(moderationCases)
  }, [moderationCases])

  useEffect(() => {
    persistNotifications(notifications)
  }, [notifications])

  const value = useMemo<AppStateValue>(
    () => ({
      currentUser,
      loginOptions,
      bookings,
      hostessProfiles,
      moderationCases,
      notifications,
      loginAs: (email: string) => {
        const selected = loginOptions.find((option) => option.email === email)

        if (!selected) {
          return
        }

        setCurrentUser({
          id: selected.role,
          email: selected.email,
          name: selected.name,
          role: selected.role,
        })
      },
      logout: () => setCurrentUser(null),
      createBooking: (input: BookingInput) => {
        let createdBooking = seededBookings[0]
        const nextBookingId = makeBookingId(bookings.length)
        const { historyEntry, notifications: nextNotifications } = buildBookingCreatedArtifacts(
          input,
          nextBookingId,
        )

        setBookings((current) => {
          createdBooking = {
            ...input,
            id: nextBookingId,
            status: input.selectedWaitress === 'No preference' ? 'confirmed' : 'pending',
            paymentStatus: 'captured',
            attendanceStatus: 'expected',
            recoveryStatus: 'monitoring',
            history: [historyEntry],
          }

          return [createdBooking, ...current]
        })

        setNotifications((current) => prependNotifications(current, ...nextNotifications))

        return createdBooking
      },
      updateBookingStatus: (bookingId, status, selectedWaitress) => {
        const booking = bookings.find((entry) => entry.id === bookingId)
        const artifacts = booking
          ? buildBookingStatusArtifacts(booking, status, selectedWaitress)
          : null

        setBookings((current) =>
          updateBookingById(current, bookingId, (entry) => ({
            ...entry,
            status,
            selectedWaitress: selectedWaitress ?? entry.selectedWaitress,
            history: artifacts ? [artifacts.historyEntry, ...entry.history] : entry.history,
          })),
        )

        if (artifacts) {
          setNotifications((current) => prependNotifications(current, ...artifacts.notifications))
        }
      },
      updateBookingPayment: (bookingId, paymentStatus, note) => {
        const booking = bookings.find((entry) => entry.id === bookingId)
        const artifacts = booking
          ? buildBookingPaymentArtifacts(booking, paymentStatus, note)
          : null

        setBookings((current) =>
          updateBookingById(current, bookingId, (entry) => ({
            ...entry,
            paymentStatus,
            history: artifacts ? [artifacts.historyEntry, ...entry.history] : entry.history,
          })),
        )

        if (artifacts) {
          setNotifications((current) => prependNotifications(current, ...artifacts.notifications))
        }
      },
      updateBookingAttendance: (bookingId, attendanceStatus, note) => {
        const booking = bookings.find((entry) => entry.id === bookingId)
        const artifacts = booking
          ? buildBookingAttendanceArtifacts(booking, attendanceStatus, note)
          : null

        setBookings((current) =>
          updateBookingById(current, bookingId, (entry) => ({
            ...entry,
            attendanceStatus,
            recoveryStatus:
              attendanceStatus === 'no-show' && entry.recoveryStatus === 'none'
                ? 'monitoring'
                : entry.recoveryStatus,
            history: artifacts ? [artifacts.historyEntry, ...entry.history] : entry.history,
          })),
        )

        if (artifacts) {
          setNotifications((current) => prependNotifications(current, ...artifacts.notifications))
        }
      },
      updateBookingRecovery: (bookingId, recoveryStatus, note) => {
        const booking = bookings.find((entry) => entry.id === bookingId)
        const artifacts = booking
          ? buildBookingRecoveryArtifacts(booking, recoveryStatus, note)
          : null

        setBookings((current) =>
          updateBookingById(current, bookingId, (entry) => ({
            ...entry,
            recoveryStatus,
            history: artifacts ? [artifacts.historyEntry, ...entry.history] : entry.history,
          })),
        )

        if (artifacts) {
          setNotifications((current) => prependNotifications(current, ...artifacts.notifications))
        }
      },
      cancelBooking: (bookingId, reason) => {
        const booking = bookings.find((entry) => entry.id === bookingId)
        const actor = currentUser?.name ?? 'Operator'
        const artifacts = booking
          ? buildBookingCancellationArtifacts(booking, actor, reason)
          : null

        setBookings((current) =>
          updateBookingById(current, bookingId, (entry) => ({
            ...entry,
            status: 'cancelled',
            history: artifacts ? [artifacts.historyEntry, ...entry.history] : entry.history,
          })),
        )

        if (artifacts) {
          setNotifications((current) => prependNotifications(current, ...artifacts.notifications))
        }
      },
      updateHostessApproval: (profileId, approvalStatus) => {
        setHostessProfiles((current) =>
          updateHostessProfileById(current, profileId, (profile) => ({
            ...profile,
            approvalStatus,
          })),
        )

        setNotifications((current) => prependNotifications(
          current,
          buildHostessApprovalNotification(profileId, approvalStatus),
        ))
      },
      updateBottleRequest: (profileId, bottleRequestStatus) => {
        setHostessProfiles((current) =>
          updateHostessProfileById(current, profileId, (profile) => ({
            ...profile,
            bottleRequestStatus,
          })),
        )

        setNotifications((current) => prependNotifications(
          current,
          buildBottleRequestNotification(profileId, bottleRequestStatus),
        ))
      },
      updateModerationCase: (caseId, state, confirmationCount) => {
        setModerationCases((current) =>
          updateModerationCaseById(current, caseId, (moderationCase) => ({
            ...moderationCase,
            state,
            confirmationCount:
              confirmationCount ?? moderationCase.confirmationCount,
          })),
        )

        setNotifications((current) => prependNotifications(
          current,
          buildModerationCaseNotification(caseId, state, confirmationCount),
        ))
      },
      createOperatorNotification: (
        title: string,
        detail: string,
        tone: NotificationRecord['tone'] = 'accent',
        link?: string,
        category: NotificationRecord['category'] = 'system',
        actor?: string,
      ) => {
        setNotifications((current) =>
          prependNotifications(
            current,
            buildOperatorNotification(title, detail, tone, link, category, actor),
          ),
        )
      },
      markNotificationRead: (notificationId) => {
        setNotifications((current) => markNotificationReadById(current, notificationId))
      },
      markAllNotificationsRead: () => {
        setNotifications((current) => markAllNotificationsRead(current))
      },
    }),
    [bookings, currentUser, hostessProfiles, moderationCases, notifications],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}
