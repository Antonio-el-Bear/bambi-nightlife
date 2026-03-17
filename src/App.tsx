import type { ReactNode } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { useAuth } from './hooks/useAuth'
import { AnalyticsScreen } from './screens/AnalyticsScreen'
import { BookingDetailScreen } from './screens/BookingDetailScreen'
import { BookingsScreen } from './screens/BookingsScreen'
import { HostessScreen } from './screens/HostessScreen'
import { LoginScreen } from './screens/LoginScreen'
import { OperationsScreen } from './screens/OperationsScreen'
import { OverviewScreen } from './screens/OverviewScreen'
import { ServiceScreen } from './screens/ServiceScreen'
import { canAccessScreen, getDefaultRouteForRole } from './data/access'
import type { UserRole } from './types'

function ProtectedScreen({
  screen,
  currentUserRole,
  children,
}: {
  screen: 'overview' | 'bookings' | 'hostess' | 'service' | 'operations' | 'analytics'
  currentUserRole: UserRole
  children: ReactNode
}) {
  if (!canAccessScreen(currentUserRole, screen)) {
    return <Navigate to={getDefaultRouteForRole(currentUserRole)} replace />
  }

  return children
}

function App() {
  const { currentUser } = useAuth()
  const currentUserRole = currentUser?.role ?? 'guest'

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={currentUser ? '/app' : '/login'} replace />}
      />
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/app" replace /> : <LoginScreen />}
      />
      <Route
        path="/app"
        element={currentUser ? <AppLayout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<OverviewScreen />} />
        <Route
          path="bookings"
          element={
            <ProtectedScreen screen="bookings" currentUserRole={currentUserRole}>
              <BookingsScreen />
            </ProtectedScreen>
          }
        />
        <Route
          path="bookings/:bookingId"
          element={
            <ProtectedScreen screen="bookings" currentUserRole={currentUserRole}>
              <BookingDetailScreen />
            </ProtectedScreen>
          }
        />
        <Route
          path="hostess"
          element={
            <ProtectedScreen screen="hostess" currentUserRole={currentUserRole}>
              <HostessScreen />
            </ProtectedScreen>
          }
        />
        <Route
          path="service"
          element={
            <ProtectedScreen screen="service" currentUserRole={currentUserRole}>
              <ServiceScreen />
            </ProtectedScreen>
          }
        />
        <Route
          path="operations"
          element={
            <ProtectedScreen screen="operations" currentUserRole={currentUserRole}>
              <OperationsScreen />
            </ProtectedScreen>
          }
        />
        <Route
          path="analytics"
          element={
            <ProtectedScreen screen="analytics" currentUserRole={currentUserRole}>
              <AnalyticsScreen />
            </ProtectedScreen>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
