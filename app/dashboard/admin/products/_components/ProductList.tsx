'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Plus, ChevronDown } from 'lucide-react'
import * as AccordionPrimitive from "@radix-ui/react-accordion"

import { deleteProduct } from '@/app/dashboard/admin/products/_lib/product.actions'
import { deleteCharacteristic } from '@/app/dashboard/admin/products/_lib/characteristic.actions'
import { ProductType } from '@/app/dashboard/admin/products/_lib/product.schema'
import { CharacteristicType } from '@/app/dashboard/admin/products/_lib/characteristic.schema'

import { Accordion, AccordionContent, AccordionItem } from '@/src/components/ui/accordion'
import ItemActionMenu from '@/src/components/ui/ItemActionMenu'
import { ConfirmationDialog } from '@/src/components/ui/ConfirmationDialog'
import { Button } from '@/src/components/ui/Button'
import ProductModal from './ProductModal'
import CharacteristicModal from './CharacteristicModal'
import { FormState } from '@/src/types'

interface ProductListProps {
  products: ProductType[] 
}

type DialogState = {
  isOpen: boolean
  id: string | null
  type: 'product' | 'characteristic' | null
}

export default function ProductList({ products }: ProductListProps) {
  const [isPending, startTransition] = useTransition()

  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCharacteristicModalOpen, setIsCharacteristicModalOpen] = useState(false)
  const [dialogState, setDialogState] = useState<DialogState>({ isOpen: false, id: null, type: null })

  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null)
  const [selectedCharacteristic, setSelectedCharacteristic] = useState<CharacteristicType | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<string>('')

  const openDialog = (id: string, type: DialogState['type']) => {
    setDialogState({ isOpen: true, id, type })
  }

  const closeDialog = () => {
    setDialogState({ isOpen: false, id: null, type: null })
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsProductModalOpen(true)
  }

  const handleEditProduct = (product: ProductType) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const handleDelete = () => {
    if (!dialogState.id || !dialogState.type) return

    let action: (id: string) => Promise<FormState>

    switch (dialogState.type) {
      case 'product':
        action = deleteProduct
        break
      case 'characteristic':
        action = deleteCharacteristic
        break
      default:
        return
    }

    startTransition(async () => {
      const result = await action(dialogState.id!)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
      closeDialog()
    })
  }

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false)
    setSelectedProduct(null)
  }

  const handleAddCharacteristic = (productId: string) => {
    setSelectedCharacteristic(null)
    setSelectedProductId(productId)
    setIsCharacteristicModalOpen(true)
  }

  const handleEditCharacteristic = (characteristic: CharacteristicType) => {
    setSelectedCharacteristic(characteristic)
    setSelectedProductId(characteristic.productId)
    setIsCharacteristicModalOpen(true)
  }

  const handleCloseCharacteristicModal = () => {
    setIsCharacteristicModalOpen(false)
    setSelectedCharacteristic(null)
    setSelectedProductId('')
  }

  const dialogMessages = {
    product: {
      title: '¿Estás seguro de que quieres eliminar este producto?',
      description: 'Esta acción no se puede deshacer. Se eliminará el producto y todas sus características asociadas.',
    },
    characteristic: {
      title: '¿Estás seguro de que quieres eliminar esta característica?',
      description: 'Esta acción no se puede deshacer.',
    },
  }

  const getDialogContent = () => {
    if (!dialogState.type) return { title: '', description: '' }
    return dialogMessages[dialogState.type]
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" /> Añadir Producto
        </Button>
      </div>

      <main className="py-4">
        {products && products.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {products.map(product => (
              <AccordionItem
                value={`item-${product.id}`}
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md"
              >
                <AccordionPrimitive.Header className="flex items-center justify-between w-full px-4 py-2">
                  <AccordionPrimitive.Trigger className="flex flex-1 items-center text-left font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-800 dark:text-white">
                        {product.name}
                      </span>
                      <p className="ml-2 text-sm text-gray-600 dark:text-gray-400 bg-lime-200 dark:bg-lime-700 p-0.5 rounded-md">
                        ${product.price} / {product.durationInDays} días
                      </p>
                      {product.isActive ? (
                        <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Activo</span>
                      ) : (
                        <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Inactivo</span>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ml-auto" />
                  </AccordionPrimitive.Trigger>
                  <div className="flex items-center gap-2 pl-4">
                    <Button variant="outline" size="sm" onClick={() => handleAddCharacteristic(product.id!)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir Característica
                    </Button>
                    <ItemActionMenu
                      onEdit={() => handleEditProduct(product)}
                      onDelete={() => openDialog(product.id!, 'product')}
                    />
                  </div>
                </AccordionPrimitive.Header>
                <AccordionContent className="p-4 space-y-2">
                  {product.characteristics && product.characteristics.length > 0 ? (
                    <ul className="space-y-1 list-inside text-gray-600 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700 pl-4">
                      {product.characteristics.map(char => (
                        <li
                          key={char.id}
                          className="flex justify-between items-center px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <div>
                            <span className="font-semibold">{char.name}</span>
                          </div>
                          <ItemActionMenu
                            onEdit={() => handleEditCharacteristic(char)}
                            onDelete={() => openDialog(char.id!, 'characteristic')}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400 italic py-4">
                      No hay características para este producto.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No hay Productos
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Aún no se han agregado productos.
            </p>
          </div>
        )} 
      </main>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
        product={selectedProduct}
      />

      <CharacteristicModal
        isOpen={isCharacteristicModalOpen}
        onClose={handleCloseCharacteristicModal}
        productId={selectedProductId}
        characteristic={selectedCharacteristic}
      />

      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        onConfirm={handleDelete}
        title={getDialogContent().title}
        description={getDialogContent().description}
        isPending={isPending}
      />
    </div>
  )
}