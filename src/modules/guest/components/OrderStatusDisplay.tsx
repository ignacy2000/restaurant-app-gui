import type { Order, OrderStatus } from '../../restaurants/modules/orders/types/order.types'

const STEPS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']

const STEP_LABEL: Record<OrderStatus, string> = {
  pending: 'Złożone',
  confirmed: 'Przyjęte',
  preparing: 'W przygotowaniu',
  ready: 'Gotowe do odbioru',
  delivered: 'Dostarczone',
  cancelled: 'Anulowane',
}

interface Props {
  order: Order
}

export function OrderStatusDisplay({ order }: Props) {
  if (order.status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <p className="font-bold text-red-700 mb-1">Zamówienie anulowane</p>
        <p className="text-sm text-red-500">Skontaktuj się z obsługą.</p>
      </div>
    )
  }

  const currentIdx = STEPS.indexOf(order.status)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <p className="font-bold text-gray-900 mb-4">Status zamówienia</p>

      <div className="flex flex-col gap-2">
        {STEPS.map((step, idx) => {
          const done = idx < currentIdx
          const active = idx === currentIdx
          return (
            <div key={step} className="flex items-center gap-3">
              <div className={`size-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                done ? 'bg-green-500 text-white' :
                active ? 'bg-blue-600 text-white' :
                'bg-gray-100 text-gray-400'
              }`}>
                {done ? '✓' : idx + 1}
              </div>
              <span className={`text-sm ${active ? 'font-semibold text-gray-900' : done ? 'text-gray-500' : 'text-gray-300'}`}>
                {STEP_LABEL[step]}
              </span>
              {active && (
                <span className="ml-auto text-xs text-blue-600 font-medium animate-pulse">
                  teraz
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 font-medium mb-2">Zamówione pozycje:</p>
        <ul className="text-sm text-gray-700 space-y-1">
          {order.items.map((item: { id: string; name: string; quantity: number }) => (
            <li key={item.id} className="flex gap-2">
              <span className="font-medium">×{item.quantity}</span>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
