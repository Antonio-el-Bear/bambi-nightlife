import { createContext } from 'react'
import type {
  AttendancePost,
  AuthUser,
  BookingRecord,
  HostessProfile,
  LoginOption,
  ModerationCase,
  NotificationRecord,
  VenueManagementSettings,
} from '../types'

export type BookingInput = Omit<BookingRecord, 'id' | 'status' | 'paymentStatus' | 'attendanceStatus' | 'recoveryStatus' | 'history'>

export type AppStateValue = {
  currentUser: AuthUser | null
  loginOptions: LoginOption[]
  bookings: BookingRecord[]
  attendancePosts: AttendancePost[]
  hostessProfiles: HostessProfile[]
  moderationCases: ModerationCase[]
  notifications: NotificationRecord[]
  venueManagementSettings: VenueManagementSettings
  loginAs: (email: string) => void
  logout: () => void
  updateCurrentUserProfile: (updates: Partial<Pick<AuthUser, 'name' | 'avatarUrl'>>) => void
  createAttendancePost: (input: Pick<AttendancePost, 'clubName' | 'attendingDate' | 'caption' | 'platforms'>) => void
  createBooking: (input: BookingInput) => BookingRecord
  updateBookingStatus: (
    bookingId: string,
    status: BookingRecord['status'],
    selectedWaitress?: string,
  ) => void
  updateBookingPayment: (
    bookingId: string,
    paymentStatus: BookingRecord['paymentStatus'],
    note?: string,
  ) => void
  updateBookingAttendance: (
    bookingId: string,
    attendanceStatus: BookingRecord['attendanceStatus'],
    note?: string,
  ) => void
  updateBookingRecovery: (
    bookingId: string,
    recoveryStatus: BookingRecord['recoveryStatus'],
    note?: string,
  ) => void
  cancelBooking: (bookingId: string, reason?: string) => void
  updateHostessApproval: (
    profileId: string,
    approvalStatus: HostessProfile['approvalStatus'],
  ) => void
  updateBottleRequest: (
    profileId: string,
    bottleRequestStatus: HostessProfile['bottleRequestStatus'],
  ) => void
  updateModerationCase: (
    caseId: string,
    state: ModerationCase['state'],
    confirmationCount?: number,
  ) => void
  createOperatorNotification: (
    title: string,
    detail: string,
    tone?: NotificationRecord['tone'],
    link?: string,
    category?: NotificationRecord['category'],
    actor?: string,
  ) => void
  updateVenueManagementSettings: (
    updates: Partial<Omit<VenueManagementSettings, 'updatedAt'>>,
    actor?: string,
  ) => void
  markNotificationRead: (notificationId: string) => void
  markAllNotificationsRead: () => void
}

export const AppStateContext = createContext<AppStateValue | null>(null)
