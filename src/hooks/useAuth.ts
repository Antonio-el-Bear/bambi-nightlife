import { useAppState } from './useAppState'

export function useAuth() {
  const { currentUser, loginAs, loginOptions, logout } = useAppState()

  return {
    currentUser,
    loginAs,
    loginOptions,
    logout,
  }
}