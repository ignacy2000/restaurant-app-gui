import { useState, useEffect } from 'react'
import { callsApi } from '../services/calls.api'
import type { WaiterCall, CallStatus } from '../types/call.types'

export function useCalls(restaurantId: string) {
  const [calls, setCalls] = useState<WaiterCall[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    callsApi.getActiveByRestaurant(restaurantId)
      .then(data => setCalls(data))
      .catch(err => setError(err instanceof Error ? err.message : 'Błąd pobierania wezwań'))
      .finally(() => setLoading(false))
  }, [restaurantId])

  async function updateStatus(callId: string, status: CallStatus) {
    await callsApi.updateStatus(restaurantId, callId, { status })
    setCalls(prev => {
      if (status === 'done') return prev.filter(c => c.id !== callId)
      return prev.map(c => c.id === callId ? { ...c, status } : c)
    })
  }

  function upsert(call: WaiterCall) {
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
  }

  return { calls, loading, error, updateStatus, upsert }
}
