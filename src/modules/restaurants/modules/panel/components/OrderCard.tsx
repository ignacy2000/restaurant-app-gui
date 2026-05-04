import { useState } from 'react'
import type { Order, OrderStatus } from '../../orders/types/order.types'

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Oczekuje',
  confirmed: 'Przyjęte',
  preparing: 'W przygotowaniu',
  ready: 'Gotowe',
  delivered: 'Dostarczone',
  cancelled: 'Anulowane',
}

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-indigo-100 text-indigo-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-100 text-red-600',
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'delivered',
}

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending: 'Potwierdź',
  confirmed: 'Zacznij przygotowanie',
  preparing: 'Oznacz jako gotowe',
  ready: 'Oznacz jako dostarczone',
}

interface Props {
  order: Order
  tableNumber?: number
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>
}

export function OrderCard({ order, tableNumber, onUpdateStatus }: Props) {
  const [loading, setLoading] = useState(false)

  const nextStatus = NEXT_STATUS[order.status]
  const isDone = order.status === 'delivered' || order.status === 'cancelled'

  async function handleAction(status: OrderStatus) {
    setLoading(true)
    try { await onUpdateStatus(order.id, status) } finally { setLoading(false) }
  }

  const time = new Date(order.created_at).toLocaleTimeString('pl-PL', {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className={`bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-3 transition ${isDone ? 'opacity-60' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-gray-900">
            {tableNumber != null ? `Stolik #${tableNumber}` : 'Stolik'}
          </p>
          <p className="text-xs text-gray-400">{time}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_COLOR[order.status]}`}>
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <ul className="text-sm text-gray-700 space-y-1">
        {order.items.map(item => (
          <li key={item.id} className="flex items-baseline gap-1.5">
            <span className="font-medium text-gray-900">×{item.quantity}</span>
            <span>{item.name}</span>
            {item.notes && <span className="text-gray-400 text-xs">({item.notes})</span>}
          </li>
        ))}
      </ul>

      {order.notes && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          Uwagi: {order.notes}
        </p>
      )}

      {!isDone && (
        <div className="flex gap-2 pt-1">
          {nextStatus && (
            <button
              onClick={() => handleAction(nextStatus)}
              disabled={loading}
              className="flex-1 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg transition hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
            >
              {loading ? '…' : NEXT_LABEL[order.status]}
            </button>
          )}
          {order.status !== 'ready' && (
            <button
              onClick={() => handleAction('cancelled')}
              disabled={loading}
              className="px-3 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-lg transition hover:bg-red-50 disabled:opacity-60 cursor-pointer"
            >
              Anuluj
            </button>
          )}
        </div>
      )}
    </div>
  )
}
