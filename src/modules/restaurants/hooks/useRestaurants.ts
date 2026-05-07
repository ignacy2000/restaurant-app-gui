import { useCallback, useEffect, useState } from 'react'
import { restaurantsApi } from '../services/restaurants.api'
import type { Restaurant, CreateRestaurantReq } from '../types/restaurant.types'

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchRestaurants() {
      try {
        setLoading(true)
        setError(null)
        const data = await restaurantsApi.getMyRestaurants()
        if (!cancelled) setRestaurants(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Błąd pobierania restauracji')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchRestaurants()
    return () => { cancelled = true }
  }, [])

  const create = useCallback(async (data: CreateRestaurantReq): Promise<Restaurant> => {
    const created = await restaurantsApi.createRestaurant(data)
    setRestaurants(prev => [...prev, created])
    return created
  }, [])

  return { restaurants, loading, error, create }
}

export function useRestaurant(id: string) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchRestaurant() {
      try {
        setLoading(true)
        setError(null)
        const data = await restaurantsApi.getRestaurant(id)
        if (!cancelled) setRestaurant(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Błąd pobierania restauracji')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchRestaurant()
    return () => { cancelled = true }
  }, [id])

  return { restaurant, loading, error }
}
