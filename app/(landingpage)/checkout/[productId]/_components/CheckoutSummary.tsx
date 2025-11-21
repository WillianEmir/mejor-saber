'use client'

import { useState, useMemo } from 'react'
import { ProductType } from '@/app/dashboard/admin/products/_lib/product.schema'
import { CheckIcon } from '@heroicons/react/24/outline'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label' 
import Link from 'next/link'
import PaymentOptionsModal from './PaymentOptionsModal'
import ManualPaymentModal from './ManualPaymentModal' // Import the new modal

interface CheckoutSummaryProps {
  product: ProductType
  userId: string
  publicKey: string
}

export default function CheckoutSummary({ product, userId, publicKey }: CheckoutSummaryProps) {
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isManualPaymentModalOpen, setIsManualPaymentModalOpen] = useState(false) // State for manual payment modal
  const [selectedManualPaymentMethod, setSelectedManualPaymentMethod] = useState<string | null>(null) // State for selected manual payment method
  const [numberOfStudents, setNumberOfStudents] = useState(1)
  const [schoolName, setSchoolName] = useState('')
  const [daneCode, setDaneCode] = useState('')

  const isInstitucional = useMemo(
    () => product.name.toLowerCase().includes('institucional'),
    [product.name]
  )

  

  const subtotal = isInstitucional ? product.price * numberOfStudents : product.price
  const total = subtotal // For now, no taxes or discounts

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true)
  }

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false)
  }

  const handleManualPaymentSelect = (method: string) => {
    setSelectedManualPaymentMethod(method)
    setIsPaymentModalOpen(false) // Close the main payment options modal
    setIsManualPaymentModalOpen(true) // Open the manual payment modal
  }

  const handleCloseManualPaymentModal = () => {
    setIsManualPaymentModalOpen(false)
    setSelectedManualPaymentMethod(null)
  }

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    setNumberOfStudents(value > 0 ? value : 1)
  }

  const isPaymentDisabled = isInstitucional && (!numberOfStudents || numberOfStudents < 1 || !schoolName || !daneCode)

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden md:grid md:grid-cols-2 gap-8 p-6">
          {/* Product Details Section */}
          <div className="md:border-r md:border-gray-200 dark:md:border-gray-700 md:pr-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Resumen de tu Compra
            </h2>
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {product.description}
              </p>
              <div className="flex items-baseline gap-x-2 mb-4">
                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                  ${product.price}
                </span>
                <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                  / {isInstitucional ? 'estudiante' : `${product.durationInDays} días`}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Características Incluidas:
              </h4>
              <ul role="list" className="space-y-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {product.characteristics.map((characteristic) => (
                  <li key={characteristic.id} className="flex gap-x-3">
                    <CheckIcon className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                    {characteristic.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary and Payment Section */}
          <div className="md:pl-8 mt-8 md:mt-0">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Detalles del Pedido
            </h3>
            
            {isInstitucional && (
              <div className="mb-6 space-y-4">
                <div>
                  <Label htmlFor="students" className="text-lg font-semibold text-gray-800 dark:text-white">
                    Número de Estudiantes
                  </Label>
                  <Input
                    id="students"
                    type="number"
                    min="1"
                    value={numberOfStudents}
                    onChange={handleStudentChange}
                    className="mt-2"
                    placeholder="Cantidad de estudiantes"
                  />
                </div>
                <div>
                  <Label htmlFor="schoolName" className="text-lg font-semibold text-gray-800 dark:text-white">
                    Nombre de la Institución
                  </Label>
                  <Input
                    id="schoolName"
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="mt-2"
                    placeholder="Nombre de la institución"
                  />
                </div>
                <div>
                  <Label htmlFor="daneCode" className="text-lg font-semibold text-gray-800 dark:text-white">
                    Código DANE
                  </Label>
                  <Input
                    id="daneCode"
                    type="text"
                    value={daneCode}
                    onChange={(e) => setDaneCode(e.target.value)}
                    className="mt-2"
                    placeholder="Código DANE de la institución"
                  />
                </div>
              </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6">
              <div className="flex justify-between text-gray-700 dark:text-gray-200 mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-200 mb-4">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4 flex justify-between font-bold text-xl text-gray-900 dark:text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full py-3 text-lg" onClick={handleOpenPaymentModal} disabled={isPaymentDisabled}>
              Proceder al Pago
            </Button>
            <Link href="/precios" passHref>
              <Button variant="outline" className="w-full py-3 text-lg mt-4">
                Regresar a Precios
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <PaymentOptionsModal 
        isOpen={isPaymentModalOpen} 
        onClose={handleClosePaymentModal} 
        onManualPaymentSelect={handleManualPaymentSelect} // Pass the new callback
        productId={product.id || ''}
        numeroDeEstudiantes={numberOfStudents}
        nombreEscuela={schoolName}
        codigoDane={daneCode}
        publicKey={publicKey}
      />

      {selectedManualPaymentMethod && (
        <ManualPaymentModal
          isOpen={isManualPaymentModalOpen}
          onClose={handleCloseManualPaymentModal}
          paymentMethod={selectedManualPaymentMethod}
          productId={product.id || ''}
          userId={userId}
          totalAmount={total}
          schoolName={schoolName}
          daneCode={daneCode}
          numberOfStudents={numberOfStudents}
        />
      )}
    </>
  )
}
