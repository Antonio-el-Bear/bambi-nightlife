import { useAppState } from './useAppState'

export function useOperationsActions() {
  const {
    bookings,
    currentUser,
    moderationCases,
    notifications,
    updateModerationCase,
  } = useAppState()

  return {
    bookings,
    currentUser,
    moderationCases,
    notifications,
    updateModerationCase,
  }
}