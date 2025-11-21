'use client'

import { OrderStatus } from '@/src/generated/prisma'
import { updateOrderStatus } from '../_lib/order.actions'
import { toast } from 'sonner'

interface OrderStatusChangerProps {
  orderId: string
  currentStatus: OrderStatus
}

export default function OrderStatusChanger({ orderId, currentStatus }: OrderStatusChangerProps) {

  const handleStatusChange = async (  event: React.ChangeEvent<HTMLSelectElement> ) => {
    const newStatus = event.target.value as OrderStatus
    const result = await updateOrderStatus(orderId, newStatus)
    if (result.message) {
      toast.success(result.message)
    } else if (result.errors) {
      toast.error(Object.values(result.errors).join(', '))
    }
  }

  return (
    <select
      value={currentStatus}
      onChange={handleStatusChange}
      className="p-2 border rounded-md"
    >
      {Object.values(OrderStatus).map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  )
}
