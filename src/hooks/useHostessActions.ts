import { useAppState } from './useAppState'

export function useHostessActions() {
  const {
    currentUser,
    hostessProfiles,
    updateBottleRequest,
    updateHostessApproval,
  } = useAppState()

  return {
    currentUser,
    hostessProfiles,
    updateBottleRequest,
    updateHostessApproval,
  }
}