import { NextResponse } from 'next/server';
import { Payment } from 'mercadopago';
import { mercadoPagoClient } from '@/src/lib/mercadopago';
import prisma from '@/src/lib/prisma';

export async function POST(req: Request) { 
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type === 'payment') {
      const paymentId = data.id;

      // Obtener la información completa del pago desde Mercado Pago
      const paymentInfo = await new Payment(mercadoPagoClient).get({ id: paymentId });

      if (paymentInfo && paymentInfo.external_reference) {
        const orderId = paymentInfo.external_reference;

        // Verificar que la orden exista y esté pendiente
        const order = await prisma.order.findUnique({
          where: { id: orderId },
        });

        if (!order || order.status !== 'PENDING') {
          // Si la orden no existe o ya fue procesada, ignorar la notificación pero confirmar recepción.
          return NextResponse.json({ received: true, message: 'Order not found or already processed.' }, { status: 200 });
        }

        // Actualizar la base de datos según el estado del pago
        if (paymentInfo.status === 'approved') {
          // Usar una transacción para asegurar la atomicidad de las operaciones
          await prisma.$transaction(async (tx) => {
            // 1. Actualizar el estado de la orden a 'COMPLETED'
            await tx.order.update({
              where: { id: orderId },
              data: { status: 'COMPLETED' },
            });

            // 2. Crear el registro del pago
            await tx.payment.create({
              data: {
                orderId: orderId,
                amount: paymentInfo.transaction_amount || 0,
                status: 'COMPLETED',
                mercadoPagoPaymentId: paymentInfo.id?.toString(),
              },
            });

            // 3. Aquí puedes añadir lógica adicional, como:
            // - Activar una suscripción para el usuario (si aplica)
            // - Enviar un email de confirmación de compra
            // - Asignar roles o permisos
          });
        } else if (['rejected', 'cancelled', 'refunded'].includes(paymentInfo.status || '')) {
          // Si el pago es rechazado o cancelado, actualizar el estado de la orden a 'FAILED'
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'FAILED' },
          });
        }
      }
    }

    // Es crucial responder con un 200 OK para que Mercado Pago sepa que recibiste la notificación.
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('[MERCADOPAGO_WEBHOOK_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Webhook processing failed', details: errorMessage }, { status: 500 });
  }
}