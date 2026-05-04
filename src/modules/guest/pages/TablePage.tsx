import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useWebSocket, type WsEvent } from '../../../shared/hooks/useWebSocket'
import { getWsUrl } from '../../../shared/utils/ws'
import { restaurantsApi } from '../../restaurants/services/restaurants.api'
import { tablesApi } from '../../restaurants/modules/tables/services/tables.api'
import { ordersApi } from '../../restaurants/modules/orders/services/orders.api'
import { CallWaiterButton } from '../components/CallWaiterButton'
import { OrderBuilder } from '../components/OrderBuilder'
import { OrderStatusDisplay } from '../components/OrderStatusDisplay'
import { Spinner } from '../../../shared/components/Spinner'
import type { Restaurant } from '../../restaurants/types/restaurant.types'
import type { Table } from '../../restaurants/modules/tables/types/table.types'
import type { Order, CreateOrderItemReq } from '../../restaurants/modules/orders/types/order.types'

export function TablePage() {
  const { restaurantId, tableId } = useParams<{ restaurantId: string; tableId: string }>()

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [table, setTable] = useState<Table | null>(null)
  const [infoLoading, setInfoLoading] = useState(true)
  const [infoError, setInfoError] = useState('')

  const [order, setOrder] = useState<Order | null>(null)
  const [orderDone, setOrderDone] = useState(false)

  useEffect(() => {
    Promise.all([
      restaurantsApi.getRestaurant(restaurantId!),
      tablesApi.getByRestaurant(restaurantId!),
    ])
      .then(([rest, tables]) => {
        setRestaurant(rest)
        setTable(tables.find(t => t.id === tableId) ?? null)
      })
      .catch(() => setInfoError('Nie znaleziono stolika'))
      .finally(() => setInfoLoading(false))
  }, [restaurantId, tableId])

  const wsUrl = getWsUrl(`/ws/restaurants/${restaurantId}/tables/${tableId}`)

  useWebSocket(wsUrl, (event: WsEvent) => {
    if (event.type === 'order.status_changed') {
      const updated = event.payload as Order
      setOrder(prev => prev?.id === updated.id ? updated : prev)
    }
  })

  async function handleOrderSubmit(items: CreateOrderItemReq[], notes: string) {
    const created = await ordersApi.create(restaurantId!, tableId!, { items, notes })
    setOrder(created)
    setOrderDone(true)
  }

  if (infoLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (infoError || !restaurant || !table) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-bold text-gray-900 mb-1">Nie znaleziono stolika</p>
          <p className="text-sm text-gray-500">Sprawdź kod QR i spróbuj ponownie</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{restaurant.name}</p>
        <h1 className="text-2xl font-extrabold text-gray-900">Stolik #{table.number}</h1>
        {restaurant.address && (
          <p className="text-xs text-gray-400 mt-0.5">📍 {restaurant.address}</p>
        )}
      </div>

      <div className="max-w-lg mx-auto px-6 py-6 flex flex-col gap-6">

        {/* Call waiter */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Obsługa</h2>
          <CallWaiterButton restaurantId={restaurantId!} tableId={tableId!} />
        </section>

        {/* Order section */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Zamówienie</h2>

          {orderDone && order ? (
            <div className="flex flex-col gap-4">
              <OrderStatusDisplay order={order} />
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <p className="text-xs text-center text-gray-400">
                  Status aktualizuje się automatycznie
                </p>
              )}
              {(order.status === 'delivered' || order.status === 'cancelled') && (
                <button
                  onClick={() => { setOrder(null); setOrderDone(false) }}
                  className="w-full py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  Złóż nowe zamówienie
                </button>
              )}
            </div>
          ) : (
            <OrderBuilder restaurantId={restaurantId!} onSubmit={handleOrderSubmit} />
          )}
        </section>

      </div>
    </div>
  )
}
