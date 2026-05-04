import { http, authedHttp } from '../../../shared/services/http'
import type { Restaurant, CreateRestaurantReq } from '../types/restaurant.types'

export const restaurantsApi = {
  async getMyRestaurants(): Promise<Restaurant[]> {
    const data = await authedHttp<Restaurant[] | null>('/restaurants/my')
    return data ?? []
  },

  getRestaurant: (id: string) =>
    http<Restaurant>(`/restaurants/${id}`),

  createRestaurant: (data: CreateRestaurantReq) =>
    authedHttp<Restaurant>('/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
