import React from 'react'
import { getOrders } from './_lib/order.data'
import { notFound } from 'next/navigation'
import OrderList from './_components/OrdersList'

export default async function page() {
  const orders = await getOrders()

  if(!orders) notFound()
  
    return (
    <OrderList orders={orders} />
  )
}
