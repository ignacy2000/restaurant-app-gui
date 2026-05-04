import { useState, useEffect } from 'react'
import { restaurantsApi } from '../services/restaurants.api'
import type { Restaurant, CreateRestaurantReq } from '../types/restaurant.types'

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    restaurantsApi.getMyRestaurants()
      .then(setRestaurants)
      .catch(err => setError(err instanceof Error ? err.message : 'Błąd pobierania restauracji'))
      .finally(() => setLoading(false))
  }, [])

  async function create(data: CreateRestaurantReq): Promise<Restaurant> {
    const created = await restaurantsApi.createRestaurant(data)
    setRestaurants(prev => [...prev, created])
    return created
  }

  return { restaurants, loading, error, create }
}

export function useRestaurant(id: string) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    restaurantsApi.getRestaurant(id)
      .then(setRestaurant)
      .catch(err => setError(err instanceof Error ? err.message : 'Błąd pobierania restauracji'))
      .finally(() => setLoading(false))
  }, [id])

  return { restaurant, loading, error }
}
