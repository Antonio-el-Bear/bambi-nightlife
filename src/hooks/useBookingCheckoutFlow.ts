import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useBookingActions } from './useBookingActions'
import type { BookingRecord, BookingTable } from '../types'

export function useBookingCheckoutFlow({
  selectedTable,
  totalSteps,
}: {
  selectedTable: BookingTable
  totalSteps: number
}) {
  const { createBooking, currentUser } = useBookingActions()
  const [currentStep, setCurrentStep] = useState(0)
  const [latestBooking, setLatestBooking] = useState<BookingRecord | null>(null)
  const [guestName, setGuestName] = useState(currentUser?.name ?? 'Lerato Mokoena')
  const [guestEmail, setGuestEmail] = useState(currentUser?.email ?? 'guest@bambi.local')
  const [guestCount, setGuestCount] = useState('8')
  const [bookingDate, setBookingDate] = useState('2026-03-21')
  const [bookingTime, setBookingTime] = useState('22:00')
  const [selectedWaitress, setSelectedWaitress] = useState('Kayla M.')
  const [preOrderSummary, setPreOrderSummary] = useState('2 premium bottles, 1 seafood platter')

  useEffect(() => {
    if (!currentUser) {
      return
    }

    setGuestName(currentUser.name)
    setGuestEmail(currentUser.email)
  }, [currentUser])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (currentStep < totalSteps - 1) {
      setCurrentStep((step) => step + 1)
      return
    }

    const created = createBooking({
      guestName,
      guestEmail,
      tableId: selectedTable.id,
      area: selectedTable.area,
      guests: Number(guestCount),
      date: bookingDate,
      time: bookingTime,
      selectedWaitress,
      preOrderSummary,
      depositAmount: selectedTable.fee,
    })

    setLatestBooking(created)
    setCurrentStep(0)
  }

  function goBack() {
    setCurrentStep((step) => Math.max(step - 1, 0))
  }

  return {
    currentStep,
    latestBooking,
    guestName,
    setGuestName,
    guestEmail,
    setGuestEmail,
    guestCount,
    setGuestCount,
    bookingDate,
    setBookingDate,
    bookingTime,
    setBookingTime,
    selectedWaitress,
    setSelectedWaitress,
    preOrderSummary,
    setPreOrderSummary,
    handleSubmit,
    goBack,
  }
}