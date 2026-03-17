import { useMemo } from 'react'
import { getAccessibleNavItems, getScreenFromPathname } from '../data/access'
import { useAuth } from './useAuth'
import { useAppState } from './useAppState'

export function useAppShellModel(pathname: string) {
  const { currentUser, logout } = useAuth()
  const { markAllNotificationsRead, markNotificationRead, notifications } = useAppState()

  const activeScreen = getScreenFromPathname(pathname)
  const accessibleItems = useMemo(
    () => getAccessibleNavItems(currentUser?.role ?? 'guest'),
    [currentUser?.role],
  )
  const activeItem = accessibleItems.find((item) => item.id === activeScreen) ?? accessibleItems[0]
  const visibleNotifications = useMemo(
    () =>
      notifications.filter((notification) => {
        const roleMatches = notification.roleTargets.includes(currentUser?.role ?? 'guest')
        const userMatches = !notification.userEmail || notification.userEmail === currentUser?.email

        return roleMatches && userMatches
      }),
    [currentUser?.email, currentUser?.role, notifications],
  )

  return {
    currentUser,
    logout,
    markAllNotificationsRead,
    markNotificationRead,
    activeScreen,
    accessibleItems,
    activeItem,
    visibleNotifications,
  }
}