import { useState, useEffect } from 'react'
import { menusApi } from '../services/menus.api'
import type { Menu, CreateMenuReq } from '../types/menu.types'

export function useMenus(restaurantId: string) {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    menusApi.getByRestaurant(restaurantId)
      .then(setMenus)
      .catch(err => setError(err instanceof Error ? err.message : 'Błąd pobierania menu'))
      .finally(() => setLoading(false))
  }, [restaurantId])

  async function create(data: CreateMenuReq): Promise<Menu> {
    const created = await menusApi.create(restaurantId, data)
    setMenus(prev => [...prev, created])
    return created
  }

  return { menus, loading, error, create }
}
