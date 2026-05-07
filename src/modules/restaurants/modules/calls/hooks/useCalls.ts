import { useCallback, useEffect, useState } from 'react'
import { callsApi } from '../services/calls.api'
import type { WaiterCall, CallStatus } from '../types/call.types'

export function useCalls(restaurantId: string) {
  const [calls, setCalls] = useState<WaiterCall[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchCalls() {
      try {
        setLoading(true)
        setError(null)
        const data = await callsApi.getActiveByRestaurant(restaurantId)
        if (!cancelled) setCalls(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Błąd pobierania wezwań')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCalls()
    return () => { cancelled = true }
  }, [restaurantId])

  const updateStatus = useCallback(async (callId: string, status: CallStatus) => {
    let previous: WaiterCall[] | null = null
    setCalls(prev => {
      previous = prev
      if (status === 'done') return prev.filter(c => c.id !== callId)
      return prev.map(c => c.id === callId ? { ...c, status } : c)
    })
    try {
      await callsApi.updateStatus(restaurantId, callId, { status })
    } catch (err) {
      if (previous !== null) setCalls(previous)
      setError(err instanceof Error ? err.message : 'Błąd aktualizacji wezwania')
    }
  }, [restaurantId])

  const upsert = useCallback((call: WaiterCall) => {
    setCalls(prev => {
      const idx = prev.findIndex(c => c.id === call.id)
      if (call.status === 'done') {
        return idx >= 0 ? prev.filter(c => c.id !== call.id) : prev
      }
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = call
        return next
      }
      return [...prev, call]
    })
  }, [])

  return { calls, loading, error, updateStatus, upsert }
}
