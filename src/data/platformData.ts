import type {
  BookingTable,
  ChecklistItem,
  InsightCard,
  MetricBar,
  NavItem,
  QueueItem,
  RewardTier,
  Stat,
  TimelineStep,
} from '../types'

export const navItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    shortLabel: 'Home',
    eyebrow: 'System view',
    title: 'Venue operating system overview',
    description:
      'A single front-end for luxury bookings, female guest growth, waitress workflows, moderation, and management visibility.',
    allowedRoles: ['guest', 'hostess', 'waitress', 'management', 'admin'],
  },
  {
    id: 'bookings',
    label: 'Bookings',
    shortLabel: 'Book',
    eyebrow: 'Module 2 and 5',
    title: 'Premium booking and checkout flow',
    description:
      'Secure tables with deposits, pre-orders, optional pre-authorisation, and waitress preference in one guided flow.',
    allowedRoles: ['guest', 'waitress', 'management', 'admin'],
  },
  {
    id: 'hostess',
    label: 'Female Guest',
    shortLabel: 'Guest',
    eyebrow: 'Core growth loop',
    title: 'Female guest influencer system',
    description:
      'Verification, tiering, rewards, and bottle-girl requests are built directly into the platform rather than handled informally.',
    allowedRoles: ['hostess', 'management', 'admin'],
  },
  {
    id: 'service',
    label: 'Waitress Queue',
    shortLabel: 'Service',
    eyebrow: 'Module 4',
    title: 'Waitress assignment and SLA tracking',
    description:
      'Assignments move in real time with an explicit 15-minute response window, fallbacks, and visible escalation paths.',
    allowedRoles: ['waitress', 'management', 'admin'],
  },
  {
    id: 'operations',
    label: 'Operations',
    shortLabel: 'Ops',
    eyebrow: 'Control room',
    title: 'Moderation, arrivals, and floor operations',
    description:
      'Door staff, management, and security share a clean operational picture without exposing unnecessary controls.',
    allowedRoles: ['management', 'admin'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    shortLabel: 'Metrics',
    eyebrow: 'Reporting model',
    title: 'Revenue, conversion, and service analytics',
    description:
      'Metrics are aligned to the brief: booking conversion, revenue by area, female guest performance, response time, and no-show exposure.',
    allowedRoles: ['management', 'admin'],
  },
]

export const overviewStats: Stat[] = [
  {
    label: 'Scoped modules',
    value: '7',
    detail: 'Mirrors the signed scope of work for the base platform.',
    tone: 'accent',
  },
  {
    label: 'Confirmation SLA',
    value: '15 min',
    detail: 'Waitress requests are accepted, declined, or auto-reassigned.',
    tone: 'positive',
  },
  {
    label: 'Moderation rule',
    value: '2-step',
    detail: 'Security confirmation plus management sign-off before deactivation.',
    tone: 'urgent',
  },
  {
    label: 'Live surfaces',
    value: '4',
    detail: 'Guest, female guest, waitress, and management-facing views.',
  },
]

export const overviewPillars: InsightCard[] = [
  {
    eyebrow: 'Revenue certainty',
    title: 'Deposits and pre-orders move value collection ahead of the night.',
    description:
      'The platform stops relying on informal promises by converting table intent into paid bookings and optional pre-authorised spend.',
  },
  {
    eyebrow: 'Traffic engine',
    title: 'Female guest profiles replace promoter dependence with a measurable growth loop.',
    description:
      'Profile approval, reward tiers, and actual walk-in performance become product data instead of side-channel coordination.',
  },
  {
    eyebrow: 'Operational control',
    title: 'Staffing, moderation, and arrivals all stay visible inside one command model.',
    description:
      'Management can react to service bottlenecks and conduct issues without switching systems or chasing messages.',
  },
]

export const deliveryPhases: TimelineStep[] = [
  {
    step: '01',
    title: 'Guest booking and checkout',
    description:
      'Select a venue zone, secure the table with a non-refundable fee, add pre-orders, and optionally request a waitress.',
  },
  {
    step: '02',
    title: 'Female guest onboarding',
    description:
      'Collect ID-linked age verification, social handles, and manual approval before a profile goes live.',
  },
  {
    step: '03',
    title: 'Service workflow automation',
    description:
      'Push assignments to waitresses in real time and automatically reassign on inactivity or decline.',
  },
  {
    step: '04',
    title: 'Management oversight and analytics',
    description:
      'Track bookings, hostess sessions, moderation decisions, refunds, and nightly performance from one dashboard.',
  },
]

export const bookingSteps: TimelineStep[] = [
  {
    step: '1',
    title: 'Choose area and table',
    description:
      'VIP, lounge, and terrace inventory is visualized instead of buried in a form.',
  },
  {
    step: '2',
    title: 'Secure the booking',
    description:
      'Capture the booking fee immediately and optionally hold a minimum-spend pre-authorisation.',
  },
  {
    step: '3',
    title: 'Prepare service and arrivals',
    description:
      'Waitress notifications, hostess request eligibility, and entrance readiness all begin once payment clears.',
  },
]

export const bookingTables: BookingTable[] = [
  { id: 'VIP-04', area: 'VIP Ring', capacity: '8 guests', fee: 'R2,500', status: 'reserved' },
  { id: 'VIP-07', area: 'VIP Ring', capacity: '10 guests', fee: 'R3,200', status: 'available' },
  { id: 'VIP-11', area: 'Stage Edge', capacity: '12 guests', fee: 'R4,000', status: 'hostess' },
  { id: 'LNG-02', area: 'Lounge', capacity: '6 guests', fee: 'R1,400', status: 'available' },
  { id: 'LNG-05', area: 'Lounge', capacity: '6 guests', fee: 'R1,650', status: 'reserved' },
  { id: 'TER-03', area: 'Terrace', capacity: '4 guests', fee: 'R1,100', status: 'available' },
]

export const bookingPolicies: ChecklistItem[] = [
  {
    title: 'OTP sign-up and booking verification',
    detail: 'Guests are verified before the booking enters the service flow.',
  },
  {
    title: 'Non-refundable booking fee',
    detail: 'The table is secured immediately and no-show risk is reduced up front.',
  },
  {
    title: 'Optional pre-order and pre-swipe',
    detail: 'Food, beverage prep, and minimum spend commitments stay aligned to the booking.',
  },
  {
    title: 'Preferred waitress request',
    detail: 'A guest can select a waitress or leave the system to auto-match the best available option.',
  },
]

export const hostessChecks: ChecklistItem[] = [
  {
    title: 'SA ID age extraction',
    detail: 'The system verifies that the applicant is 19 or older before review proceeds.',
  },
  {
    title: 'Manual admin approval',
    detail: 'Photo, bio, and linked social accounts are checked for venue fit before activation.',
  },
  {
    title: 'Tier assignment',
    detail: 'Management can grade a profile by following size, engagement quality, and venue fit.',
  },
  {
    title: 'Bottle-girl session tracking',
    detail: 'Requests from paying tables are logged from acceptance through the one-hour session end.',
  },
]

export const rewardTiers: RewardTier[] = [
  { groupSize: 'She + 3 friends', reward: '1 bottle + 1 six-pack' },
  { groupSize: 'She + 5 friends', reward: '1 bottle + 2 six-packs' },
  { groupSize: 'She + 6 friends', reward: '2 bottles + 3 six-packs + 1 two-pack' },
  { groupSize: 'She + 8 friends', reward: '2 bottles + 4 six-packs + 1 two-pack' },
  { groupSize: 'She + 11 friends', reward: '3 bottles + 5 six-packs + 2 two-packs' },
]

export const hostessQueue: QueueItem[] = [
  {
    title: 'Naledi P. profile awaiting final approval',
    detail: 'ID verified. Social links reviewed. Pending venue-fit sign-off from management.',
    meta: 'Tier candidate: Gold',
    tone: 'accent',
  },
  {
    title: 'Bottle-girl request active for VIP-11',
    detail: 'Request sent by a verified deposit-paying table holder for a one-hour service slot.',
    meta: 'Response window: 9 minutes left',
    tone: 'urgent',
  },
  {
    title: 'Zinhle M. reward package queued',
    detail: 'Group size verified at six total guests. Package prepared for entrance confirmation.',
    meta: 'Reward: 1 bottle + 2 six-packs',
    tone: 'positive',
  },
]

export const serviceStats: Stat[] = [
  {
    label: 'Median response time',
    value: '06:12',
    detail: 'Measured against the 15-minute confirmation window.',
    tone: 'positive',
  },
  {
    label: 'Auto-reassignment rate',
    value: '9%',
    detail: 'Shows where staffing availability or attention is slipping.',
  },
  {
    label: 'Preferred waitress matches',
    value: '71%',
    detail: 'Guest-selected service relationships are preserved where possible.',
    tone: 'accent',
  },
]

export const serviceQueue: QueueItem[] = [
  {
    title: 'Kayla M. accepted VIP-04',
    detail: 'Preferred waitress selected by the guest. Both sides received confirmation instantly.',
    meta: 'Accepted in 3 minutes',
    tone: 'positive',
  },
  {
    title: 'Rina N. response window is closing',
    detail: 'If no action is taken, LNG-05 moves to the next available waitress automatically.',
    meta: '4 minutes remaining',
    tone: 'urgent',
  },
  {
    title: 'Terrace bookings ready for auto-match',
    detail: 'Three bookings were created without a preference and can be balanced by the system.',
    meta: 'Queue: 3 tables',
  },
]

export const moderationQueue: QueueItem[] = [
  {
    title: 'Ayanda K. flagged for review',
    detail: 'One staff report is on file. A second independent confirmation is required before management can escalate.',
    meta: 'Status: first confirmation logged',
    tone: 'urgent',
  },
  {
    title: 'Management sign-off pending',
    detail: 'A separate case has met the two-person rule and now waits for venue management decision.',
    meta: 'Evidence pack attached',
    tone: 'accent',
  },
  {
    title: 'Administrator reversal control active',
    detail: 'Only the system administrator can reverse an already-confirmed ban.',
    meta: 'Protected action',
    tone: 'positive',
  },
]

export const arrivalBoard: QueueItem[] = [
  {
    title: 'Naledi P. arriving at 22:10',
    detail: 'Tier Gold. Party size 6. Linked to an active hostess-enabled booking.',
    meta: 'IoT entrance view',
    tone: 'accent',
  },
  {
    title: 'Zinhle M. arriving at 22:25',
    detail: 'Tier Silver. Reward package should be prepared before entry verification.',
    meta: 'Party size 4',
  },
  {
    title: 'Door staff synced',
    detail: 'Tablet view is read-only and surfaces profile photo, handle, group size, tier, and ETA.',
    meta: 'Read-only device mode',
    tone: 'positive',
  },
]

export const analyticsKpis: Stat[] = [
  {
    label: 'Projected revenue',
    value: 'R184k',
    detail: 'Tonight’s combined booking, pre-order, and secured minimum spend target.',
    tone: 'accent',
  },
  {
    label: 'VIP occupancy',
    value: '87%',
    detail: 'Expected by midnight based on live reservations and check-ins.',
    tone: 'positive',
  },
  {
    label: 'Hostess-led arrivals',
    value: '14',
    detail: 'Approved profiles expected to convert into actual walk-ins tonight.',
  },
  {
    label: 'No-show coverage',
    value: '57%',
    detail: 'Exposure recovered through the platform’s configured pre-authorisation rules.',
    tone: 'urgent',
  },
]

export const analyticsBars: MetricBar[] = [
  {
    label: 'VIP revenue share',
    value: 82,
    detail: '82% of tonight’s target is already secured through deposits and pre-orders.',
    fillClass: 'fill-82',
  },
  {
    label: 'Female guest conversion',
    value: 68,
    detail: '68% of approved profiles generated a confirmed walk-in this month.',
    fillClass: 'fill-68',
  },
  {
    label: 'Waitress SLA success',
    value: 91,
    detail: '91% of assignments were accepted inside the 15-minute window.',
    fillClass: 'fill-91',
  },
  {
    label: 'Bottle-girl request completion',
    value: 73,
    detail: 'Most accepted sessions were completed and logged without manual intervention.',
    fillClass: 'fill-73',
  },
]

export const analyticsNotes: ChecklistItem[] = [
  {
    title: 'Revenue by area',
    detail: 'Track performance across VIP, lounge, terrace, and any future venue zones.',
  },
  {
    title: 'Tier effectiveness',
    detail: 'Measure which profile tiers actually produce the best attendance and spend.',
  },
  {
    title: 'Service quality patterns',
    detail: 'Use waitress response and assignment behavior to spot staffing pressure early.',
  },
  {
    title: 'Penalty recovery',
    detail: 'Review how much no-show risk is converted into protected revenue rather than lost margin.',
  },
]
