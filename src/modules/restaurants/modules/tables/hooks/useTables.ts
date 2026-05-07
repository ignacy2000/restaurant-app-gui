import { useCallback, useEffect, useState } from 'react'
import { tablesApi } from '../services/tables.api'
import type { Table, CreateTableReq, UpdateTableReq } from '../types/table.types'

export function useTables(restaurantId: string) {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchTables() {
      try {
        setLoading(true)
        setError(null)
        const data = await tablesApi.getByRestaurant(restaurantId)
        if (!cancelled) setTables(data.sort((a, b) => a.number - b.number))
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Błąd pobierania stolików')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTables()
    return () => { cancelled = true }
  }, [restaurantId])

  const create = useCallback(async (data: CreateTableReq): Promise<Table> => {
    const created = await tablesApi.create(restaurantId, data)
    setTables(prev => [...prev, created].sort((a, b) => a.number - b.number))
    return created
  }, [restaurantId])

  const updateCapacity = useCallback(async (tableId: string, data: UpdateTableReq): Promise<void> => {
    let previous: Table[] | null = null
    setTables(prev => {
      previous = prev
      return prev.map(t => t.id === tableId ? { ...t, ...data } : t)
    })
    try {
      const updated = await tablesApi.updateCapacity(restaurantId, tableId, data)
      setTables(prev => prev.map(t => t.id === tableId ? updated : t))
    } catch (err) {
      if (previous !== null) setTables(previous)
      setError(err instanceof Error ? err.message : 'Błąd aktualizacji stolika')
    }
  }, [restaurantId])

  const remove = useCallback(async (tableId: string): Promise<void> => {
    let previous: Table[] | null = null
    setTables(prev => { previous = prev; return prev.filter(t => t.id !== tableId) })
    try {
      await tablesApi.delete(restaurantId, tableId)
    } catch (err) {
      if (previous !== null) setTables(previous)
      setError(err instanceof Error ? err.message : 'Błąd usuwania stolika')
    }
  }, [restaurantId])

  return { tables, loading, error, create, updateCapacity, remove }
}
