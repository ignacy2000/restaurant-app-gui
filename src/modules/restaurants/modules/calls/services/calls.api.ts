import { http, authedHttp } from '../../../../../shared/services/http'
import type { WaiterCall, UpdateCallStatusReq } from '../types/call.types'

export const callsApi = {
  create: (restaurantId: string, tableId: string) =>
    http<WaiterCall>(`/restaurants/${restaurantId}/tables/${tableId}/calls`, {
      method: 'POST',
    }),

  async getByRestaurant(restaurantId: string): Promise<WaiterCall[]> {
    const data = await authedHttp<WaiterCall[] | null>(`/restaurants/${restaurantId}/calls`)
    return data ?? []
  },

  updateStatus: (restaurantId: string, callId: string, data: UpdateCallStatusReq) =>
    authedHttp<void>(`/restaurants/${restaurantId}/calls/${callId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
}
