import { useAppState } from './useAppState'

export function useVenueManagementActions() {
  const { currentUser, updateVenueManagementSettings, venueManagementSettings } = useAppState()

  return {
    currentUser,
    venueManagementSettings,
    updateVenueManagementSettings,
  }
}