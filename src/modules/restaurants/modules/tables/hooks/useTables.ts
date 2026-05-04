import { useState, useEffect } from 'react'
import { tablesApi } from '../services/tables.api'
import type { Table, CreateTableReq, UpdateTableReq } from '../types/table.types'

export function useTables(restaurantId: string) {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    tablesApi.getByRestaurant(restaurantId)
      .then(data => setTables(data.sort((a, b) => a.number - b.number)))
      .catch(err => setError(err instanceof Error ? err.message : 'Błąd pobierania stolików'))
      .finally(() => setLoading(false))
  }, [restaurantId])

  async function create(data: CreateTableReq): Promise<Table> {
    const created = await tablesApi.create(restaurantId, data)
    setTables(prev => [...prev, created].sort((a, b) => a.number - b.number))
    return created
  }

  async function updateCapacity(tableId: string, data: UpdateTableReq): Promise<void> {
    const updated = await tablesApi.updateCapacity(restaurantId, tableId, data)
    setTables(prev => prev.map(t => t.id === tableId ? updated : t))
  }

  async function remove(tableId: string): Promise<void> {
    await tablesApi.delete(restaurantId, tableId)
    setTables(prev => prev.filter(t => t.id !== tableId))
  }

  return { tables, loading, error, create, updateCapacity, remove }
}
