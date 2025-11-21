import { clientMP } from '@/src/lib/mp';
import { Preference } from 'mercadopago';
import React from 'react'

export default async function PruebaMP() {

  const preference = await new Preference(clientMP).create({
    body: {
      items: [
        {
          id: '123',
          title: 'Mi producto',
          quantity: 1,
          unit_price: 2000
        }
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL_PORT}dashboard/payment/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL_PORT}dashboard/payment/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL_PORT}dashboard/payment/pending`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL_PORT}api/webhooks/mercadopago`,
    }
  })
 
  return (
    <>
      <div>Id: {preference.id}</div>
      <div>Id: {preference.back_urls?.success}</div>
    </>
  )
}
