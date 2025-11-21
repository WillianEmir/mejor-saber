'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog'
import { Button } from '@/src/components/ui/Button'
import { CreditCardIcon, QrCodeIcon, KeyIcon } from '@heroicons/react/24/outline'
import { Wallet, initMercadoPago } from '@mercadopago/sdk-react'

interface PaymentOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  onManualPaymentSelect: (method: string) => void
  productId: string
  numeroDeEstudiantes: number
  nombreEscuela?: string
  codigoDane?: string
  publicKey: string
}

const paymentOptions = [
  {
    name: 'Tarjeta de Crédito o Débito',
    icon: CreditCardIcon,
    description: 'Paga de forma segura con tu tarjeta.',
    isManual: false,
  },
  {
    name: 'Transferencia a Nequi',
    icon: QrCodeIcon,
    description: 'Transfiere desde tu cuenta Nequi.',
    isManual: true,
  },
  {
    name: 'Con código QR desde tu banca móvil',
    icon: QrCodeIcon, // Reusing QrCodeIcon
    description: 'Escanea el código QR para pagar desde tu aplicación bancaria.',
    isManual: true,
  },
  {
    name: 'Llave Bancaria',
    icon: KeyIcon,
    description: 'Usa una llave bancaria para la transferencia.',
    isManual: true,
  },
]

export default function PaymentOptionsModal({ isOpen, onClose, onManualPaymentSelect, productId, numeroDeEstudiantes, nombreEscuela, codigoDane, publicKey }: PaymentOptionsModalProps) {
  
  const [isLoading, setIsLoading] = useState(false)
  const [showMercadoPagoWallet, setShowMercadoPagoWallet] = useState(false)
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  initMercadoPago(publicKey)  
  
  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/payments/create-preference', {
        headers: { 'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
          productId: productId,
          quantity: numeroDeEstudiantes,
          schoolName: nombreEscuela,
          daneCode: codigoDane,
        }),        
      })

      const data = await response.json()  

      if (data.id) { // Mercado Pago returns 'id' for the preference
        setPreferenceId(data.id)
        setShowMercadoPagoWallet(true)
        console.log(data.id)
      } else {
        console.error('Error al obtener el preference ID:', data.error)
        alert('Hubo un error al iniciar el pago. Inténtalo de nuevo.')
      }
    } catch (error) {
      console.error('Error en la solicitud de pago:', error)
      alert('Hubo un error de conexión. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptionClick = async (optionName: string, isManual: boolean) => {
    if (isManual) {
      onManualPaymentSelect(optionName)
    } else {
      await handlePayment()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {showMercadoPagoWallet ? 'Completa tu pago' : 'Elige tu método de pago'}
          </DialogTitle>
        </DialogHeader>
        {showMercadoPagoWallet && preferenceId ? (
          <div className="mt-6">
            <Wallet initialization={{ preferenceId: preferenceId }} />
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-4">
              {paymentOptions.map((option) => (
                <button
                  key={option.name}
                  className="w-full flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
                  onClick={() => handleOptionClick(option.name, option.isManual)}
                  disabled={isLoading}
                >
                  <option.icon className="h-8 w-8 text-blue-600 mr-4" />
                  <div className="text-left">
                    <p className="font-semibold text-lg text-gray-900 dark:text-white">{option.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                {isLoading ? 'Procesando...' : 'Cancelar'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
