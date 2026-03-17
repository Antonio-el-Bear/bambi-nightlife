import { useMemo, useState } from 'react'
import { useOperationsActions } from './useOperationsActions'
import { buildOperationsFeed } from '../utils/operationsFeed'

const SAVED_FEED_VIEW_KEY = 'bambi-operations-feed-view'

export type OperationsFeedSourceFilter = 'all' | 'Booking' | 'Moderation' | 'Notification'
export type OperationsFeedCategoryFilter =
  | 'all'
  | 'booking'
  | 'payments'
  | 'attendance'
  | 'recovery'
  | 'moderation'
  | 'system'

type SavedFeedView = {
  sourceFilter: OperationsFeedSourceFilter
  categoryFilter: OperationsFeedCategoryFilter
}

function getSavedFeedViewFromStorage(storageKey: string | null) {
  if (!storageKey || typeof window === 'undefined') {
    return null
  }

  const saved = window.localStorage.getItem(storageKey)

  if (!saved) {
    return null
  }

  return JSON.parse(saved) as SavedFeedView
}

export function useOperationsFeedView() {
  const { bookings, currentUser, moderationCases, notifications } = useOperationsActions()
  const currentUserEmail = currentUser?.email
  const savedFeedStorageKey = currentUserEmail
    ? `${SAVED_FEED_VIEW_KEY}:${currentUserEmail}`
    : null
  const initialSavedView = getSavedFeedViewFromStorage(savedFeedStorageKey)
  const [sourceFilter, setSourceFilter] = useState<OperationsFeedSourceFilter>(
    initialSavedView?.sourceFilter ?? 'all',
  )
  const [categoryFilter, setCategoryFilter] = useState<OperationsFeedCategoryFilter>(
    initialSavedView?.categoryFilter ?? 'all',
  )
  const [savedViewAvailable, setSavedViewAvailable] = useState(initialSavedView !== null)

  const operationsFeed = useMemo(
    () => buildOperationsFeed(bookings, moderationCases, notifications),
    [bookings, moderationCases, notifications],
  )

  const filteredFeed = useMemo(
    () =>
      operationsFeed
        .filter((entry) => (sourceFilter === 'all' ? true : entry.source === sourceFilter))
        .filter((entry) => (categoryFilter === 'all' ? true : entry.category === categoryFilter))
        .slice(0, 10),
    [categoryFilter, operationsFeed, sourceFilter],
  )

  function getCurrentView(): SavedFeedView {
    return {
      sourceFilter,
      categoryFilter,
    }
  }

  function applyView(view: SavedFeedView) {
    setSourceFilter(view.sourceFilter)
    setCategoryFilter(view.categoryFilter)
  }

  function applyPreset(preset: 'critical' | 'commercial' | 'reset') {
    if (preset === 'reset') {
      setSourceFilter('all')
      setCategoryFilter('all')
      return
    }

    if (preset === 'critical') {
      setSourceFilter('all')
      setCategoryFilter('moderation')
      return
    }

    setSourceFilter('all')
    setCategoryFilter('payments')
  }

  function saveView() {
    if (!savedFeedStorageKey || typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(savedFeedStorageKey, JSON.stringify(getCurrentView()))
    setSavedViewAvailable(true)
  }

  function loadView() {
    if (!savedFeedStorageKey || typeof window === 'undefined') {
      return
    }

    const saved = window.localStorage.getItem(savedFeedStorageKey)

    if (!saved) {
      return
    }

    applyView(JSON.parse(saved) as SavedFeedView)
    setSavedViewAvailable(true)
  }

  function clearView() {
    if (!savedFeedStorageKey || typeof window === 'undefined') {
      return
    }

    window.localStorage.removeItem(savedFeedStorageKey)
    setSavedViewAvailable(false)
  }

  return {
    currentUserEmail,
    sourceFilter,
    setSourceFilter,
    categoryFilter,
    setCategoryFilter,
    savedViewAvailable,
    filteredFeed,
    operationsFeed,
    bookings,
    moderationCases,
    notifications,
    applyPreset,
    saveView,
    loadView,
    clearView,
  }
}