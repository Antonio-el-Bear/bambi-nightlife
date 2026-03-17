import { navItems } from './platformData'
import type { ScreenId, UserRole } from '../types'

export const screenToRoute: Record<ScreenId, string> = {
  overview: '/app',
  bookings: '/app/bookings',
  hostess: '/app/hostess',
  service: '/app/service',
  operations: '/app/operations',
  analytics: '/app/analytics',
}

export function getScreenFromPathname(pathname: string): ScreenId {
  if (pathname.startsWith('/app/bookings')) {
    return 'bookings'
  }

  if (pathname.startsWith('/app/hostess')) {
    return 'hostess'
  }

  if (pathname.startsWith('/app/service')) {
    return 'service'
  }

  if (pathname.startsWith('/app/operations')) {
    return 'operations'
  }

  if (pathname.startsWith('/app/analytics')) {
    return 'analytics'
  }

  return 'overview'
}

export function getAccessibleNavItems(role: UserRole) {
  return navItems.filter((item) => item.allowedRoles.includes(role))
}

export function canAccessScreen(role: UserRole, screen: ScreenId) {
  return navItems.some((item) => item.id === screen && item.allowedRoles.includes(role))
}

export function getDefaultRouteForRole(role: UserRole) {
  return screenToRoute[getAccessibleNavItems(role)[0]?.id ?? 'overview']
}