import { useMemo, useState } from 'react'
import { useBookingActions } from './useBookingActions'
import type { BookingRecord } from '../types'

const SAVED_VIEW_KEY = 'bambi-bookings-saved-view'

type SavedView = {
  statusFilter: 'all' | BookingRecord['status']
  paymentFilter: 'all' | BookingRecord['paymentStatus']
  attendanceFilter: 'all' | BookingRecord['attendanceStatus']
  recoveryFilter: 'all' | BookingRecord['recoveryStatus']
  bookingSearch: string
}

type BulkAction = 'mark-arrived' | 'start-recovery' | 'mark-recovered' | 'queue-refund'

function getSavedViewFromStorage(storageKey: string | null) {
  if (!storageKey || typeof window === 'undefined') {
    return null
  }

  const saved = window.localStorage.getItem(storageKey)

  if (!saved) {
    return null
  }

  return JSON.parse(saved) as SavedView
}

export function useBookingsTriageView() {
  const {
    bookings,
    currentUser,
    createOperatorNotification,
    updateBookingAttendance,
    updateBookingPayment,
    updateBookingRecovery,
  } = useBookingActions()
  const savedViewStorageKey = currentUser?.email
    ? `${SAVED_VIEW_KEY}:${currentUser.email}`
    : null
  const initialSavedView = getSavedViewFromStorage(savedViewStorageKey)
  const [statusFilter, setStatusFilter] = useState<'all' | BookingRecord['status']>(
    initialSavedView?.statusFilter ?? 'all',
  )
  const [paymentFilter, setPaymentFilter] = useState<'all' | BookingRecord['paymentStatus']>(
    initialSavedView?.paymentFilter ?? 'all',
  )
  const [attendanceFilter, setAttendanceFilter] = useState<
    'all' | BookingRecord['attendanceStatus']
  >(initialSavedView?.attendanceFilter ?? 'all')
  const [recoveryFilter, setRecoveryFilter] = useState<'all' | BookingRecord['recoveryStatus']>(
    initialSavedView?.recoveryFilter ?? 'all',
  )
  const [bookingSearch, setBookingSearch] = useState(initialSavedView?.bookingSearch ?? '')
  const [savedViewAvailable, setSavedViewAvailable] = useState(initialSavedView !== null)
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([])

  const canManageBookings =
    currentUser?.role === 'management' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'waitress'
  const canRunCommercialBulkActions =
    currentUser?.role === 'management' || currentUser?.role === 'admin'
  const canRunArrivalBulkActions =
    currentUser?.role === 'waitress' ||
    currentUser?.role === 'management' ||
    currentUser?.role === 'admin'

  const filteredBookings = useMemo(() => {
    const searchTerm = bookingSearch.trim().toLowerCase()

    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
      const matchesPayment = paymentFilter === 'all' || booking.paymentStatus === paymentFilter
      const matchesAttendance =
        attendanceFilter === 'all' || booking.attendanceStatus === attendanceFilter
      const matchesRecovery =
        recoveryFilter === 'all' || booking.recoveryStatus === recoveryFilter
      const matchesSearch =
        searchTerm.length === 0 ||
        booking.id.toLowerCase().includes(searchTerm) ||
        booking.guestName.toLowerCase().includes(searchTerm) ||
        booking.tableId.toLowerCase().includes(searchTerm)

      return (
        matchesStatus &&
        matchesPayment &&
        matchesAttendance &&
        matchesRecovery &&
        matchesSearch
      )
    })
  }, [attendanceFilter, bookingSearch, bookings, paymentFilter, recoveryFilter, statusFilter])

  const riskCounts = useMemo(
    () => ({
      noShows: bookings.filter((booking) => booking.attendanceStatus === 'no-show').length,
      openRecovery: bookings.filter((booking) => booking.recoveryStatus === 'monitoring').length,
      refundExposure: bookings.filter((booking) => booking.paymentStatus === 'refund-pending').length,
    }),
    [bookings],
  )

  const visibleSelectedIds = useMemo(
    () =>
      selectedBookingIds.filter((bookingId) =>
        filteredBookings.some((booking) => booking.id === bookingId),
      ),
    [filteredBookings, selectedBookingIds],
  )

  const visibleSelectedBookings = useMemo(
    () => filteredBookings.filter((booking) => visibleSelectedIds.includes(booking.id)),
    [filteredBookings, visibleSelectedIds],
  )

  const allVisibleSelected =
    filteredBookings.length > 0 && visibleSelectedIds.length === filteredBookings.length

  function applyView(view: SavedView) {
    setStatusFilter(view.statusFilter)
    setPaymentFilter(view.paymentFilter)
    setAttendanceFilter(view.attendanceFilter)
    setRecoveryFilter(view.recoveryFilter)
    setBookingSearch(view.bookingSearch)
  }

  function getCurrentView(): SavedView {
    return {
      statusFilter,
      paymentFilter,
      attendanceFilter,
      recoveryFilter,
      bookingSearch,
    }
  }

  function applyPreset(preset: 'reset' | 'no-show' | 'refund' | 'resolved') {
    setBookingSearch('')

    if (preset === 'reset') {
      setStatusFilter('all')
      setPaymentFilter('all')
      setAttendanceFilter('all')
      setRecoveryFilter('all')
      return
    }

    if (preset === 'no-show') {
      setStatusFilter('all')
      setPaymentFilter('all')
      setAttendanceFilter('no-show')
      setRecoveryFilter('monitoring')
      return
    }

    if (preset === 'refund') {
      setStatusFilter('all')
      setPaymentFilter('refund-pending')
      setAttendanceFilter('all')
      setRecoveryFilter('all')
      return
    }

    setStatusFilter('all')
    setPaymentFilter('all')
    setAttendanceFilter('all')
    setRecoveryFilter('recovered')
  }

  function saveView() {
    if (!savedViewStorageKey || typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(savedViewStorageKey, JSON.stringify(getCurrentView()))
    setSavedViewAvailable(true)
  }

  function loadView() {
    if (!savedViewStorageKey || typeof window === 'undefined') {
      return
    }

    const saved = window.localStorage.getItem(savedViewStorageKey)

    if (!saved) {
      return
    }

    applyView(JSON.parse(saved) as SavedView)
    setSavedViewAvailable(true)
  }

  function clearView() {
    if (!savedViewStorageKey || typeof window === 'undefined') {
      return
    }

    window.localStorage.removeItem(savedViewStorageKey)
    setSavedViewAvailable(false)
  }

  function toggleBookingSelection(bookingId: string) {
    setSelectedBookingIds((current) =>
      current.includes(bookingId)
        ? current.filter((id) => id !== bookingId)
        : [...current, bookingId],
    )
  }

  function toggleSelectAllVisible() {
    setSelectedBookingIds((current) => {
      if (allVisibleSelected) {
        return current.filter((id) => !filteredBookings.some((booking) => booking.id === id))
      }

      const merged = new Set([...current, ...filteredBookings.map((booking) => booking.id)])
      return [...merged]
    })
  }

  function clearVisibleSelection() {
    setSelectedBookingIds((current) => current.filter((id) => !visibleSelectedIds.includes(id)))
  }

  function runBulkAction(action: BulkAction) {
    if (visibleSelectedIds.length === 0) {
      return
    }

    visibleSelectedIds.forEach((bookingId) => {
      if (action === 'mark-arrived') {
        updateBookingAttendance(
          bookingId,
          'arrived',
          'Bulk action marked this reservation as arrived.',
        )
        return
      }

      if (action === 'start-recovery') {
        updateBookingRecovery(
          bookingId,
          'monitoring',
          'Bulk action opened recovery review for this reservation.',
        )
        return
      }

      if (action === 'mark-recovered') {
        updateBookingRecovery(
          bookingId,
          'recovered',
          'Bulk action closed this reservation as commercially recovered.',
        )
        return
      }

      updateBookingPayment(
        bookingId,
        'refund-pending',
        'Bulk action queued this reservation for refund review.',
      )
    })

    createOperatorNotification(
      action === 'mark-arrived'
        ? 'Bulk arrival update completed'
        : action === 'start-recovery'
          ? 'Bulk recovery review opened'
          : action === 'mark-recovered'
            ? 'Bulk recovery close-out completed'
            : 'Bulk refund queue created',
      `${currentUser?.name ?? 'Operator'} applied ${action} to ${visibleSelectedIds.length} bookings in triage.`,
      action === 'queue-refund' ? 'urgent' : 'accent',
      '/app/bookings',
      action === 'queue-refund' ? 'payments' : action === 'mark-arrived' ? 'attendance' : 'recovery',
      currentUser?.name ?? 'Operator',
    )

    clearVisibleSelection()
  }

  return {
    statusFilter,
    setStatusFilter,
    paymentFilter,
    setPaymentFilter,
    attendanceFilter,
    setAttendanceFilter,
    recoveryFilter,
    setRecoveryFilter,
    bookingSearch,
    setBookingSearch,
    savedViewAvailable,
    filteredBookings,
    riskCounts,
    visibleSelectedIds,
    visibleSelectedBookings,
    allVisibleSelected,
    canManageBookings,
    canRunCommercialBulkActions,
    canRunArrivalBulkActions,
    applyPreset,
    saveView,
    loadView,
    clearView,
    toggleBookingSelection,
    toggleSelectAllVisible,
    clearVisibleSelection,
    runBulkAction,
  }
}