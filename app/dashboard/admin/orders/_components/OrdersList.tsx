'use client'

import { Order as PrismaOrder, User } from "@/src/generated/prisma";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/src/components/ui/table";
import OrderStatusChanger from "./OrderStatusChanger";

type OrderWithUser = PrismaOrder & {
  user: User;
};

interface OrderListProps {
  orders: OrderWithUser[];
}

export default function OrderList({ orders }: OrderListProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Lista de Órdenes</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No hay órdenes disponibles.</p>
      ) : (
        <Table>
          <TableCaption>Una lista de las órdenes más recientes.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID de la Orden</TableHead>
              <TableHead>Email del Usuario</TableHead>
              <TableHead>Monto Total</TableHead>
              <TableHead>Método de Pago</TableHead>
              <TableHead>Referencia de Pago</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.user.email}</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>{order.referenciaPago}</TableCell>
                <TableCell>
                  <OrderStatusChanger orderId={order.id} currentStatus={order.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
