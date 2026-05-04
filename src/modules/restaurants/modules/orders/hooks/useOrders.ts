import { useState, useEffect } from 'react'
import { ordersApi } from '../services/orders.api'
import type { Order, OrderStatus } from '../types/order.types'

export function useOrders(restaurantId: string) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ordersApi.getByRestaurant(restaurantId)
      .then(data => setOrders(data))
      .catch(err => setError(err instanceof Error ? err.message : 'Błąd pobierania zamówień'))
      .finally(() => setLoading(false))
  }, [restaurantId])

  async function updateStatus(orderId: string, status: OrderStatus) {
    await ordersApi.updateStatus(restaurantId, orderId, { status })
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  }

  function upsert(order: Order) {
    setOrders(prev => {
      const idx = prev.findIndex(o => o.id === order.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = order
        return next
      }
      return [order, ...prev]
    })
  }

  return { orders, loading, error, updateStatus, upsert }
}
