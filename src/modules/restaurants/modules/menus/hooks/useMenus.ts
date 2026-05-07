import { useCallback, useEffect, useState } from 'react'
import { menusApi } from '../services/menus.api'
import type { Menu, CreateMenuReq } from '../types/menu.types'

export function useMenus(restaurantId: string) {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchMenus() {
      try {
        setLoading(true)
        setError(null)
        const data = await menusApi.getByRestaurant(restaurantId)
        if (!cancelled) setMenus(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Błąd pobierania menu')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchMenus()
    return () => { cancelled = true }
  }, [restaurantId])

  const create = useCallback(async (data: CreateMenuReq): Promise<Menu> => {
    const created = await menusApi.create(restaurantId, data)
    setMenus(prev => [...prev, created])
    return created
  }, [restaurantId])

  return { menus, loading, error, create }
}
