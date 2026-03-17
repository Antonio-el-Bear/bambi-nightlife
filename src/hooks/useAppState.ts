import { useContext } from 'react'
import { AppStateContext } from '../context/appStateTypes'

export function useAppState() {
  const value = useContext(AppStateContext)

  if (!value) {
    throw new Error('useAppState must be used within AppStateProvider')
  }

  return value
}
