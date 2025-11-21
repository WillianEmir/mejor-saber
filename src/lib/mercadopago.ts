import { MercadoPagoConfig } from 'mercadopago'; 

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) { 
  throw new Error('MERCADOPAGO_ACCESS_TOKEN is not defined');
}
 
// Se instancia el cliente de configuración con la sintaxis correcta
export const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});