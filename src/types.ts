export type ScreenId =
  | 'overview'
  | 'bookings'
  | 'hostess'
  | 'service'
  | 'operations'
  | 'analytics'

export type UserRole = 'guest' | 'hostess' | 'waitress' | 'management' | 'admin'

export type Tone = 'default' | 'positive' | 'urgent' | 'accent'

export type NavItem = {
  id: ScreenId
  label: string
  shortLabel: string
  eyebrow: string
  title: string
  description: string
  allowedRoles: UserRole[]
}

export type Stat = {
  label: string
  value: string
  detail: string
  tone?: Tone
}

export type InsightCard = {
  eyebrow: string
  title: string
  description: string
}

export type TimelineStep = {
  step: string
  title: string
  description: string
}

export type BookingTable = {
  id: string
  area: string
  capacity: string
  fee: string
  status: 'available' | 'reserved' | 'hostess'
}

export type QueueItem = {
  title: string
  detail: string
  meta: string
  tone?: Tone
}

export type RewardTier = {
  groupSize: string
  reward: string
}

export type MetricBar = {
  label: string
  value: number
  detail: string
  fillClass: string
}

export type ChecklistItem = {
  title: string
  detail: string
}

export type AuthUser = {
  id: string
  name: string
  role: UserRole
  email: string
  avatarUrl: string
}

export type BookingHistoryEntry = {
  id: string
  at: string
  title: string
  detail: string
}

export type NotificationRecord = {
  id: string
  title: string
  detail: string
  createdAt: string
  unread: boolean
  tone: Tone
  roleTargets: UserRole[]
  category: 'booking' | 'payments' | 'attendance' | 'recovery' | 'moderation' | 'system'
  actor?: string
  userEmail?: string
  link?: string
}

export type BookingRecord = {
  id: string
  guestName: string
  guestEmail: string
  tableId: string
  area: string
  guests: number
  date: string
  time: string
  selectedWaitress: string
  preOrderSummary: string
  depositAmount: string
  status: 'pending' | 'confirmed' | 'assigned' | 'cancelled'
  paymentStatus: 'captured' | 'preauth-held' | 'refund-pending' | 'refunded'
  attendanceStatus: 'expected' | 'arrived' | 'late' | 'no-show'
  recoveryStatus: 'none' | 'monitoring' | 'deposit-retained' | 'recovered' | 'waived'
  history: BookingHistoryEntry[]
}

export type HostessProfile = {
  id: string
  name: string
  handle: string
  avatarUrl: string
  tier: 'Silver' | 'Gold' | 'Platinum'
  groupSize: number
  reward: string
  approvalStatus: 'pending' | 'approved' | 'declined'
  bottleRequestStatus: 'none' | 'requested' | 'accepted'
}

export type ModerationCase = {
  id: string
  profileName: string
  reason: string
  confirmationCount: number
  state: 'flagged' | 'under-review' | 'banned' | 'reversed'
}

export type LoginOption = {
  role: UserRole
  label: string
  email: string
  name: string
  avatarUrl: string
}

export type VenueManagementSettings = {
  featuredEventTitle: string
  featuredEventSummary: string
  featuredEventPosterUrl: string
  featuredEventDate: string
  featuredEventStatus: 'draft' | 'scheduled' | 'live'
  featuredEventAudience: string
  waitressOfferTitle: string
  waitressOfferDetail: string
  waitressOfferValue: string
  updatedAt: string
}
