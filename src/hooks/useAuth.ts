import { useAppState } from './useAppState'

export function useAuth() {
  const { currentUser, loginAs, loginOptions, logout, updateCurrentUserProfile } = useAppState()

  return {
    currentUser,
    loginAs,
    loginOptions,
    logout,
    updateCurrentUserProfile,
  }
}