// SDK de Mercado Pago
import { MercadoPagoConfig } from 'mercadopago';

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) { 
  throw new Error('MERCADOPAGO_ACCESS_TOKEN is not defined');
}

// Agrega credenciales
export const clientMP = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });