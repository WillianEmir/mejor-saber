'use server'

import { NextResponse } from 'next/server';
import { Preference } from 'mercadopago';
import prisma from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { clientMP } from '@/src/lib/mp';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { productId, quantity, schoolName, daneCode } = await req.json();

    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true }
    });

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const totalAmount = product.price * quantity;

    // 2. Crear una Orden en tu base de datos con estado PENDIENTE
    const newOrder = await prisma.order.create({
      data: {
        userId: userId,
        productId: productId,
        totalAmount: totalAmount,
        status: 'PENDING',
        schoolName: schoolName,
        daneCode: daneCode,
      },
    });

    const preference = await new Preference(clientMP).create({
      body: {
        items: [
          {
            id: product.id,
            title: product.name,
            quantity: Number(quantity),
            unit_price: product.price,
          }
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL_PORT}dashboard/payment/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL_PORT}dashboard/payment/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL_PORT}dashboard/payment/pending`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL_PORT}api/webhooks/mercadopago`,
        external_reference: newOrder.id,
      }
    })

    return NextResponse.json({ id: preference.id, init_point: preference.init_point, orderId: newOrder.id });

  } catch (error) {
    console.error('[MERCADOPAGO_ERROR]', error);
    return NextResponse.json({ error: 'Error al crear la preferencia de pago' }, { status: 500 });
  }
}