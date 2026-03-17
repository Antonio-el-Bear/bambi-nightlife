import type {
  BookingRecord,
  HostessProfile,
  LoginOption,
  ModerationCase,
  NotificationRecord,
} from '../types'

export const loginOptions: LoginOption[] = [
  {
    role: 'guest',
    label: 'Guest / Client',
    email: 'guest@bambi.local',
    name: 'Lerato Mokoena',
  },
  {
    role: 'hostess',
    label: 'Female Guest',
    email: 'hostess@bambi.local',
    name: 'Naledi Phiri',
  },
  {
    role: 'waitress',
    label: 'Waitress',
    email: 'waitress@bambi.local',
    name: 'Kayla Moyo',
  },
  {
    role: 'management',
    label: 'Venue Management',
    email: 'manager@bambi.local',
    name: 'Anele Dlamini',
  },
  {
    role: 'admin',
    label: 'System Admin',
    email: 'admin@bambi.local',
    name: 'Tshiamo Naidoo',
  },
]

export const seededBookings: BookingRecord[] = [
  {
    id: 'BK-2401',
    guestName: 'Lerato Mokoena',
    guestEmail: 'guest@bambi.local',
    tableId: 'VIP-04',
    area: 'VIP Ring',
    guests: 8,
    date: '2026-03-21',
    time: '22:00',
    selectedWaitress: 'Kayla M.',
    preOrderSummary: '2 premium bottles, 1 seafood platter',
    depositAmount: 'R2,500',
    status: 'assigned',
    paymentStatus: 'captured',
    attendanceStatus: 'expected',
    recoveryStatus: 'monitoring',
    history: [
      {
        id: 'EV-2401-1',
        at: '2026-03-17 18:40',
        title: 'Booking created',
        detail: 'Reservation was captured with a preferred waitress and premium pre-order.',
      },
      {
        id: 'EV-2401-2',
        at: '2026-03-17 18:47',
        title: 'Waitress assigned',
        detail: 'Kayla M. accepted the request inside the service response window.',
      },
    ],
  },
  {
    id: 'BK-2402',
    guestName: 'Sanelisiwe Khumalo',
    guestEmail: 'skhumalo@example.com',
    tableId: 'LNG-05',
    area: 'Lounge',
    guests: 6,
    date: '2026-03-21',
    time: '21:30',
    selectedWaitress: 'Pending',
    preOrderSummary: 'Welcome cocktails only',
    depositAmount: 'R1,650',
    status: 'confirmed',
    paymentStatus: 'preauth-held',
    attendanceStatus: 'late',
    recoveryStatus: 'monitoring',
    history: [
      {
        id: 'EV-2402-1',
        at: '2026-03-17 19:05',
        title: 'Booking created',
        detail: 'Reservation captured without a confirmed waitress assignment yet.',
      },
    ],
  },
]

export const seededHostessProfiles: HostessProfile[] = [
  {
    id: 'HP-01',
    name: 'Naledi Phiri',
    handle: '@naledi.afterdark',
    tier: 'Gold',
    groupSize: 6,
    reward: '1 bottle + 2 six-packs',
    approvalStatus: 'pending',
    bottleRequestStatus: 'requested',
  },
  {
    id: 'HP-02',
    name: 'Zinhle Maseko',
    handle: '@zinhle.m',
    tier: 'Silver',
    groupSize: 4,
    reward: '1 bottle + 1 six-pack',
    approvalStatus: 'approved',
    bottleRequestStatus: 'none',
  },
  {
    id: 'HP-03',
    name: 'Aphiwe Ndlovu',
    handle: '@aphiwe.social',
    tier: 'Platinum',
    groupSize: 9,
    reward: '2 bottles + 4 six-packs + 1 two-pack',
    approvalStatus: 'pending',
    bottleRequestStatus: 'accepted',
  },
]

export const seededModerationCases: ModerationCase[] = [
  {
    id: 'MC-11',
    profileName: 'Ayanda Khumalo',
    reason: 'Security behavior flag logged near the VIP entrance.',
    confirmationCount: 1,
    state: 'flagged',
  },
  {
    id: 'MC-12',
    profileName: 'Thando Mokoena',
    reason: 'Second staff report received. Awaiting management resolution.',
    confirmationCount: 2,
    state: 'under-review',
  },
]

export const seededNotifications: NotificationRecord[] = [
  {
    id: 'NT-01',
    title: 'VIP booking moved to assigned',
    detail: 'BK-2401 now has Kayla M. attached and is ready for floor prep.',
    createdAt: '2026-03-17 18:47',
    unread: true,
    tone: 'accent',
    roleTargets: ['waitress', 'management', 'admin'],
    category: 'booking',
    actor: 'Platform',
    link: '/app/bookings/BK-2401',
  },
  {
    id: 'NT-02',
    title: 'Your lounge booking is confirmed',
    detail: 'BK-2402 remains locked in for 21:30 and is visible in the booking hub.',
    createdAt: '2026-03-17 19:05',
    unread: true,
    tone: 'positive',
    roleTargets: ['guest'],
    category: 'booking',
    actor: 'Platform',
    userEmail: 'skhumalo@example.com',
    link: '/app/bookings/BK-2402',
  },
  {
    id: 'NT-03',
    title: 'Moderation case requires decision',
    detail: 'Thando Mokoena has reached the confirmation threshold for management review.',
    createdAt: '2026-03-17 19:14',
    unread: false,
    tone: 'urgent',
    roleTargets: ['management', 'admin'],
    category: 'moderation',
    actor: 'Security',
    link: '/app/operations',
  },
]